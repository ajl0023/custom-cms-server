const express = require("express");
const knex = require("./knexInstance");
const schemaInspector = require("knex-schema-inspector").default;
const { generateModel } = require("./utils");
const inspector = schemaInspector(knex);
function genMediaCols(table) {
  //make this dynamic, before creating model, access virtual media columns...
  const mediaColumns = [
    {
      name: "images",
      multi: true,
    },
    {
      name: "thumbnail",
      multi: false,
    },
  ];
  return mediaColumns.map((item) => {
    return {
      name: item.name,
      table,
      type: "media",
      is_generated: false,
      media: JSON.stringify({
        multi: item.multi,
      }),
      default_value: false,
      is_foreign_key: false,
      is_nullable: true,
      data_type: item.multi ? "array" : "char",
    };
  });
}
async function main() {
  const has_media = await knex("entity_type").where("has_media", true);

  const tables = await inspector.tableInfo();

  for (const item of tables) {
    const media_check = has_media.find((mediaItem) => {
      return mediaItem.name === item.name;
    });

    const columns = await inspector.columnInfo(item.name);
    if (media_check) {
      columns.push(...genMediaCols(item.name));
    }

    const formattedCols = columns.map((item) => {
      const orig = {
        name: item.name,
        table: item.table,
        type: item.data_type,
        is_generated:
          item.is_generated || item.default_value === "CURRENT_TIMESTAMP",
        default_value: item.default_value ? item.default_value : false,
        is_foreign_key: Boolean(item.foreign_key_column),
        required: item.is_nullable === false,
        nullable: item.is_nullable,
      };
      return {
        schema: orig,
        clientCols: {
          ...orig,
          ...item,
          media: item.type === "media",
        },
      };
    });
    generateModel(item.name, formattedCols, media_check);
  }
  knex.destroy();
}
main();
