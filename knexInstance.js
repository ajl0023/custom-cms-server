const knex = require("knex").knex({
  client: "mysql",
  connection: {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABSE,
    port: "3306",
    charset: "utf8",
  },
  pool: { min: 0, max: 5 },
});

module.exports = knex;
