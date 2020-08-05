CREATE TABLE tallyho_tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT,
    checked BOOLEAN DEFAULT false
);

