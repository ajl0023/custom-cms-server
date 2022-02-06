const { Model, snakeCaseMappers } = require("objection");
const AjvValidator = require("objection").AjvValidator;

class Category_master extends Model {
  static get tableName() {
    return "category_master";
  }

  static get clientCols() {
    return {
      category: {
        type: "varchar",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      label: {
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
  static async afterInsert(ctx) {
    const ChildModel =
      require(`../${ctx.context.child}/${ctx.context.child}`).model;

    const res = await ChildModel.query().insert({ ...ctx.context.data });
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        category: {
          type: "varchar",
          nullable: true,
        },

        entity_type: {
          type: "varchar",
          nullable: true,
        },

        label: {
          type: "varchar",
          nullable: true,
        },
      },
    };
  }
}

module.exports = {
  model: Category_master,
};
