const express = require("express");
const app = express();
const port = 3000;
const crypto = require("crypto");
const sharp = require("sharp");
var router = express.Router();
const fs = require("fs-extra");
const router2 = express.Router();
const axios = require("axios").default;
const streamifier = require("streamifier");
var _ = require("lodash");
const ploptest = require("./ploptest");
const cloudinary = require("./cloudinary");
const dataTypes = (type) => {
  /*
   * Possible types in database
   * ================
   * varchar    bigint    longtext
   * datetime    int    tinyint
   * decimal    double    tinytext
   * text    timestamp    date
   * mediumtext    float    smallint
   * char    enum    blob
   * longblob    set
   *
   * Types available in json schema
   * string    number    object
   * array    boolean    null
   * integer    any
   *
   */
  switch (type) {
    case "boolean":
      return "boolean";
    case "array":
      return "array";
    case "varchar":
    case "longtext":
    case "tinytext":
    case "text":
    case "mediumtext":
    case "char":
      return "string";
    case "date":
      return "date";
    case "datetime":
      return "date-time";
    case "bigint":
    case "int":
    case "tinyint":
    case "smallint":
    case "timestamp":
      return "integer";
    case "decimal":
    case "double":
    case "float":
      return "number";
    default:
      return "any";
  }
};
module.exports = {
  async downloadImage(url) {
    const buffer = await axios.get(url, {
      responseType: "arraybuffer",
    });

    return buffer.data;
  },

  async generateModel(name, cols, has_media) {
    cols = cols.map((item) => {
      item.type = dataTypes(item.type);

      return item;
    });

    const view = {
      modelName: name.charAt(0).toUpperCase() + name.slice(1),
      tableName: name,
      requireds: ["test"],
      properties: cols,

      has_media: Boolean(has_media),
      is_parent: name === "category_master",
    };
    console.log(view.properties);
    if (
      cols.find((item) => {
        return item.name === "label";
      }) &&
      cols.find((item) => {
        return item.name === "parentId";
      })
    ) {
      view["has_parent"] = true;
    }

    ploptest(view);
  },
  ObjToArr(obj) {
    return Object.entries(obj).map(([k, v]) => {
      return { ...v, name: _.startCase(k) };
    });
  },
  flatten(data, category) {
    const main_data = data[category];
    const images = {};
    for (const key in main_data.properties) {
      if (Object.hasOwnProperty.call(main_data.properties, key)) {
        const element = main_data.properties[key];
        images[key] = {
          label: null,
          images: [],
          uid: element.images[0].key,
        };
        for (const image of element.images) {
          image["parentId"] = image.key;

          image["isMain"] = image["tags"][1] === "true";
          images[key]["images"].push(image);
          if (image.label) {
            images[key]["label"] = image.label;
          }
        }
      }
    }
    return images;
  },
  parseJSON(file) {
    return JSON.parse(file);
  },
  async deleteCloudinaryImages(images) {
    const res = await cloudinary.v2.api.delete_resources(images);
    console.log(res);
  },
  uploadFromBuffer(file, cloudinary, folder) {
    return new Promise((resolve, reject) => {
      let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
        },
        (err, res) => {
          if (res) {
            resolve(res);
          } else {
            console.log(err);
            reject(err);
          }
        }
      );

      streamifier.createReadStream(file).pipe(cld_upload_stream);
    });
  },
};
