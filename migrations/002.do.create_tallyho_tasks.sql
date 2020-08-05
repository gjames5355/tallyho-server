CREATE TABLE tallyho_users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

ALTER TABLE tallyho_tasks
    ADD COLUMN
        user_id INTEGER REFERENCES tallyho_users(id)
        ON DELETE SET NULL;