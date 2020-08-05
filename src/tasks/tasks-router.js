const express = require('express');
const TasksService = require('./tasks-service');
const xss = require("xss");
const { requireAuth } = require('../middleware/jwt-auth')

const TasksRouter = express.Router();
const jsonParser = express.json();
const bodyParser = express.json();

const serializeTask = task => ({
    id: task.id,
    title: xss(task.title),
    image: task.image,
    checked: task.checked,
    user_id: task.user_id
});


TasksRouter
    .route("/")
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        TasksService.getAllTasks(knexInstance)
            .then(tasks => {
                const cleanTasks = tasks.map(task => {
                    return serializeTask(task);
                });
                res.json(cleanTasks);
            })
            .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { title, image } = req.body;
        const user_id = req.user.id;

        const newTask = { title, image }

        for (const [key, value] of Object.entries(newTask)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request in request body` }
                })
            }
        }

        newTask.user_id = user_id;
        newTask.title = title;
        newTask.image = image;

        TasksService.insertTask(
            req.app.get('db'),
            newTask
        )
            .then(task => {
                res
                    .status(201)
                    .location(`/api/tasks/${task.id}`)
                    .json(serializeTask(task))
            })
            .catch(next)
    })


TasksRouter
    .route("/:task_id")
    .all(requireAuth)//basic auth
    .get((req, res, next) => {
        const knexInstance = req.app.get("db")
        TasksService.getById(knexInstance, req.params.task_id)
            .then(task => {
                if (!task) {
                    return res.status(404).json({
                        error: { message: "Task doesn't exist" }
                    });
                }
                res.json(serializeTask(task));
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const { task_id } = req.params;
        TasksService.deleteTask(
            req.app.get("db"),
            task_id
        )
            .then(numRowsAffected => {
                if (numRowsAffected > 0) {
                    return res.status(204).end();
                }
                else {
                    return res.status(404).json({
                        error: { "message": "Task Not Found" }
                    });
                }
            })
            .catch(next);
    })
    .patch(bodyParser, (req, res, next) => {
        const { title, image, checked } = req.body
        const taskToUpdate = { title, image, checked }

        const numberOfValues = Object.values(taskToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title', 'image', or 'checked'`
                }
            })

        TasksService.updateTask(
            req.app.get('db'),
            req.params.task_id,
            taskToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = TasksRouter