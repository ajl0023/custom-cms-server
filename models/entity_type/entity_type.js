const { Model, snakeCaseMappers } = require("objection");
const AjvValidator = require("objection").AjvValidator;

class Entity_type extends Model {
  static get tableName() {
    return "entity_type";
  }

  static get clientCols() {
    return {
      has_media: {
        type: "boolean",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      name: {
        type: "varchar",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      updated_at: {
        type: "datetime",
        is_generated: false,

        foreign_key: false,

        required: true,
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        has_media: {
          type: "boolean",
          nullable: true,
        },

        name: {
          type: "varchar",
          nullable: true,
        },
      },
    };
  }
}

module.exports = {
  model: Entity_type,
};
