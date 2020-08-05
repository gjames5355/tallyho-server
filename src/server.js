const app = require('./app')
const knex = require("knex")
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

// express declares the equivalent of a global variable called db
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})