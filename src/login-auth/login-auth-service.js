const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const LoginAuthService = {
    getUserWithEmail(db, email) {
        return db('tallyho_users')
            .where({ email })
            .first()
    },

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },

    // payload is {user_id: 1}
    // subject is email
    // secret is tallyho!
    // reference the post method in login router to create a jwt token
    createJwt(subject, payload) {
        const options = {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        };
        return jwt.sign(payload, config.JWT_SECRET, options);
    },

    //takes the token string (payload, subject, secret together) and decrypt it to get the secret from the string.
    //takes the secret from the string to compare to the secret on the server and validates!
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },

    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
}

module.exports = LoginAuthService;