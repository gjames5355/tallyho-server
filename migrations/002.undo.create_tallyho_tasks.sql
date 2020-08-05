ALTER TABLE tallyho_tasks
    DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS tallyho_users;