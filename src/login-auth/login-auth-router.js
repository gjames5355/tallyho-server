const express = require('express')
const LoginAuthService = require('./login-auth-service')
const LoginRouter = express.Router()
const jsonBodyParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

LoginRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body
        const loginUser = { email, password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        LoginAuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                if (!dbUser)
                    return res.status(400).json({
                        error: 'Incorrect email or password',
                    })

                return LoginAuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect email or password',
                            })

                        const sub = dbUser.email
                        const payload = { user_id: dbUser.id }
                        res.send({
                            authToken: LoginAuthService.createJwt(sub, payload),
                        })
                    })
            })
            .catch(next)
    })

    .put(requireAuth, (req, res) => {
        const sub = req.user.email
        const payload = {
            user_id: req.user.id,
        }
        res.send({
            authToken: LoginAuthService.createJwt(sub, payload),
        })
    })

module.exports = LoginRouter;