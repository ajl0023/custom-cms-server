const knex = require("./knexInstance");
const crypto = require("crypto");
const cloudinary = require("./cloudinary");
const { deleteAll } = require("./db");

module.exports = (router, inspector) => {
  router.get("/test", async (req, res) => {
    const model = require("./models/entity_type/entity_type").model;
    const data = await model.query();
    for (const table of data) {
      const tableName = table.name;
      await knex.schema.alterTable(tableName, (table) => {
        table.dropNullable("parentId");
      });
    }
    res.json(data);
  });
};
