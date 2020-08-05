const TasksService = {
    getAllTasks(knex) {
        return knex.select('*').from('tallyho_tasks').orderBy('id');
    },
    insertTask(knex, newTask) {
        return knex
            .insert(newTask)
            .into('tallyho_tasks')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, id) {
        return knex
            .from('tallyho_tasks')
            .select('*')
            .where('id', id)
            .first();
    },

    deleteTask(knex, id) {
        return knex('tallyho_tasks')
            .where({ id })
            .delete();
    },

    updateTask(knex, id, newTaskField) {
        return knex('tallyho_tasks')
            .where({ id })
            .update(newTaskField);
    }
};

module.exports = TasksService;