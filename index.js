const bookshelf = require("bookshelf")(knex);

const categories = [
  "private_homes",
  "commercials",
  "hospitality",
  "multi_family",
];
async function main() {
  categories.forEach(async (item) => {
    await knex.schema.alterTable(item, function (table) {
      table.foreign("parentId").references("category_master.uid");
    });
  });
}
main();
