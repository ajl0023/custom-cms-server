require('dotenv').config()

const express = require("express");
const app = express();
const port = 3000;

var router = express.Router();

const knex = require("./knexInstance");
const router2 = express.Router();
const router3 = express.Router();
const cors = require("cors");

const schemaInspector = require("knex-schema-inspector").default;

const inspector = schemaInspector(knex);

const { Model } = require("objection");

Model.knex(knex);

router2.post("/create_new_table", async (req, res) => {
  const { createTable } = require("./db");

  await createTable(knex, req.body);
  res.json("test");
});

require("./routes")(router, inspector);
require("./test-routes")(router2);
require("./db-routes")(router3);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", router);

app.use(router2);
app.use("/db", router3);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
