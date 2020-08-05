const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe('Login-Auth Endpoints', function () {
    let db;

    const { testUsers } = helpers.makeTasksFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('POST /api/auth/login', () => {
        this.beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        it(`responds 200 and User is able to log in`, () => {
            const userValidCreds = {
                email: testUser.email,
                password: testUser.password,
            }
            const expectedToken = jwt.sign(
                { user_id: testUser.id }, // payload
                process.env.JWT_SECRET,
                {
                    subject: testUser.email,
                    algorithm: 'HS256',
                }
            )
            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200)
        })
    })

})