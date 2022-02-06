const { Model, snakeCaseMappers } = require("objection");
const AjvValidator = require("objection").AjvValidator;

class Image extends Model {
  static get tableName() {
    return "image";
  }

  static get clientCols() {
    return {
      height: {
        type: "int",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      main: {
        type: "boolean",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      public_id: {
        type: "varchar",
        is_generated: false,

        foreign_key: false,

        required: true,
      },
      updated_at: {
        type: "datetime",
        is_generated: false,

        foreign_key: false,

        required: true,
      },
      url: {
        type: "varchar",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      width: {
        type: "int",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        height: {
          type: "int",
          nullable: true,
        },

        main: {
          type: "boolean",
          nullable: true,
        },

        parentId: {
          type: "varchar",
          nullable: true,
        },

        public_id: {
          type: "varchar",
          nullable: false,
        },

        url: {
          type: "varchar",
          nullable: true,
        },

        width: {
          type: "int",
          nullable: true,
        },
      },
    };
  }
}

module.exports = {
  model: Image,
};
