const { Model, snakeCaseMappers } = require("objection");
const AjvValidator = require("objection").AjvValidator;

class Furniture extends Model {
  static get tableName() {
    return "furniture";
  }
  static async beforeDelete(ctx) {
    const idsToDelete = await ctx.asFindQuery().select("parentId");
    const imagesToDelete = [];
    console.log(idsToDelete);
    const Images = require("../image/image").model;
    for (const item of idsToDelete) {
      const images = await Images.query().where({ parentId: item.parentId });
      const publidIds = images.map((item) => {
        return item.public_id;
      });
      await deleteCloudinaryImages(publidIds);
    }

    ctx.cancelQuery();
  }

  static get clientCols() {
    return {
      label: {
        type: "varchar",
        is_generated: false,

        foreign_key: false,

        required: false,
      },
      sub_category: {
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
      images: {
        type: "media",
        is_generated: false,

        foreign_key: false,

        media: true,

        required: false,
      },
      thumbnail: {
        type: "media",
        is_generated: false,

        foreign_key: false,

        media: true,

        required: false,
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        label: {
          type: "varchar",
          nullable: true,
        },

        parentId: {
          type: "varchar",
          nullable: false,
        },

        sub_category: {
          type: "varchar",
          nullable: true,
        },

        images: {
          type: "array",
          nullable: true,
        },

        thumbnail: {
          type: "char",
          nullable: true,
        },
      },
    };
  }

  static relationMappings = {
    images: {
      relation: Model.HasManyRelation,
      modelClass: require("../image/image").model,
      join: {
        from: "furniture.parentId",
        to: "image.parentId",
      },
    },
    thumbnail: {
      relation: Model.HasOneRelation,
      modelClass: require("../image/image").model,
      join: {
        from: "furniture.parentId",
        to: "image.parentId",
      },
      modify: {
        main: true,
      },
    },
  };
}

module.exports = {
  model: Furniture,
};
