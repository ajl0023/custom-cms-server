const knex = require("./knexInstance");
const categories = ["furniture"];
const allCategories = [
  "private_home",
  "commercial",
  "hospitality",
  "multi_family",

  "sculpture",
  "furniture",
  "concept",
  "category_master",
  "mixed_use",
  "image",
];
module.exports = {
  async createTable(knex, data) {
    const { name } = data;
    await knex.schema.createTableLike(name, "private_home", (table) => {
      table
        .foreign("parentId")
        .references("category_master.uid")
        .onDelete("Cascade")
        .onUpdate("Cascade");
    });
  },
  async deleteAll() {
    allCategories.forEach(async (element) => {
      await knex(element).del();
    });
  },
  async importData(knex, data, isThumb) {
    await knex("images").insert({
      url: data.secure_url,
      width: data.width,
      height: data.height,
      parentId: data.parentId,
      main: isThumb,
    });
  },
  async main() {
    allCategories.forEach(async (category) => {
      await knex.schema.alterTable(category, (table) => {
        table.dropColumn("thumbnail");
      });
    });
    // const promises = categories.map(async (item) => {
    //   try {
    //     return knex.schema.alterTable(item, (table) => {
    //       table.foreign("parentId").references("category_master.uid");
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     return;
    //   }
    // });
    // await Promise.all(promises);
  },
};
