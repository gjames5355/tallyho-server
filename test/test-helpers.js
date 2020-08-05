const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            email: 'testuserone@gmail.com',
            password: 'password'
        },
        {
            id: 2,
            email: 'testusertwo@gmail.com',
            password: 'password'
        },
        {
            id: 3,
            email: 'testuserthree@gmail.com',
            password: 'password'
        }

    ]
}

function makeTasksArray(users) {
    return [
        {
            id: 1,
            title: 'Legoland',
            image: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Sleeping_Beauty_Castle_2019.jpg',
            checked: false,
            user_id: 1,
        },
        {
            id: 2,
            title: 'Disneyland',
            image: 'https://timeincsecure-a.akamaihd.net/rtmp_uds/3281700261001/201911/2124/3281700261001_6105587570001_6105572256001-vs.jpg?pubId=3281700261001&videoId=6105572256001',
            checked: false,
            user_id: 1,
        },
        {
            id: 3,
            title: 'SeaWorld',
            image: 'https://cdn.getyourguide.com/img/tour_img-525172-146.jpg',
            checked: false,
            user_id: 2,
        },

    ]
}

function makeExpectedTask(users, task = []) {
    const user = users
        .find(user => user.id === task.user_id)

    return {
        id: task.id,
        title: task.title,
        image: task.image,
        user: {
            id: user.id,
            email: user.email,
            password: user.password,
        },

    }
}

function makeMaliciousTask(user) {
    const maliciousTask = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image: 'http://placehold.it/500x500',
        user_id: user.id
    }
    const expectedTask = {
        ...makeExpectedTask([user], maliciousTask),
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
        maliciousTask,
        expectedTask,
    }
}

function makeTasksFixtures() {
    const testUsers = makeUsersArray()
    const testTasks = makeTasksArray()
    return { testUsers, testTasks }
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            tallyho_tasks,
            tallyho_users
            RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('tallyho_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('tallyho_users_id_seq', ?)`,
                [users[users.length - 1].id],
            ))
}

function seedTasks(db, tasks) {
    return db.into('tallyho_tasks').insert(tasks)
        .then(() =>
            db.raw(
                `SELECT setval('tallyho_tasks_id_seq', ?)`,
                [tasks[tasks.length - 1].id],
            ))
}

function seedMaliciousTask(db, user, task) {
    return seedUsers(db, [user])
        .then(() =>
            db
                .into('tallyho_tasks')
                .insert([task])
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.email,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makeTasksArray,
    makeExpectedTask,
    makeMaliciousTask,
    makeTasksFixtures,
    cleanTables,
    seedUsers,
    seedTasks,
    seedTasksTables,
    seedMaliciousTask,
    makeAuthHeader
}
