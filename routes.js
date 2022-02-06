const knex = require("./knexInstance");
var knexnest = require("knexnest");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const upload = multer();
const _ = require("lodash");
const { parseJSON, uploadFromBuffer, ObjToArr } = require("./utils");
const { Model } = require("objection");
const cloudinary = require("./cloudinary");
var Mustache = require("mustache");
const { randomUUID } = require("crypto");
const category_master = require("./models/category_master/category_master");

module.exports = (router, inspector) => {
  router.get("/tables", async (req, res) => {
    const tables = await inspector.tables();

    res.json(tables);
  });
  router.get("/columns", async (req, res) => {
    const category = req.query.category;

    const model = require(`./models/${category}/${category}`).model;
    const jsonSchema = model.clientCols;

    const columnsToArr = ObjToArr(jsonSchema);
    res.json(columnsToArr);
  });
  router.get("/category", async (req, res) => {
    const result = knex("test");

    const test2 = await knexnest(result);
    res.json(test2);
  });
  router.get("/test", async () => {
    var view = {
      modelName: "Test",
      tableName: "test",
    };
    const test = fs.readFileSync("./test.mustache").toString();

    var output = Mustache.render(test, view);
    fs.writeFileSync("test2.js", output);
  });
  router.delete("/delete-test", async (req, res) => {
    const CategoryMaster = category_master.model;
    await require("./models/hospitality/hospitality").model.query().delete();

    res.json("success");
  });
  router.post(
    "/entry",
    upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images" }]),
    async (req, res) => {
      const body = req.body;
      const tableExists = await knex.schema.hasTable(body.category);
      const req_schema = JSON.parse(req.body.schema);

      if (tableExists) {
        let table = body.category;
        const Model = require(`./models/${table}/${table}`).model;

        const new_entry = {
          ...req_schema,
        };

        if (_.isEmpty(req.files)) {
          for (const field in req.files) {
            if (Object.hasOwnProperty.call(req.files, field)) {
              const images = req.files[field]; // array of images
              const upload_cloudinary = images.map((item) => {
                return uploadFromBuffer(item.buffer, cloudinary, table);
              });
              new_entry[field] = await Promise.all(upload_cloudinary);
            }
          }
        }

        const validated = Model.fromJson({ ...new_entry });

        if (validated) {
          const shared_id = randomUUID();
          const x = await Model.query().insertGraph({
            images: [
              {
                parentId: shared_id,
                url: "test",
              },
            ],
          });
          const parent_db = Model.superTable;
          const ParentModel =
            require(`./models/${parent_db}/${parent_db}`).model;

          const query = ParentModel.query().insert({
            uid: shared_id,
          });
          query.context({
            child: table,
            data: {
              ...validated,
              parentId: shared_id,
            },
          });

          await query;

          res.json("success");
        }
      } else {
        res.status(404).json("meh");
      }
    }
  );

  router.post("/category_item", async (req, res) => {
    //1.) upload to cloudinary
    const category = req.body.category;
    const table_name = req.body.category;
    const imagesDir = fs.readdirSync(path.join("./images", category));
    await category_master.model.query().delete().where({
      category: category,
    });
    for (const uid of imagesDir) {
      const data = parseJSON(
        fs.readFileSync(path.join("./images", category, uid, "data.json"))
      );
      const imagesFinal = [];
      const images = fs.readdirSync(
        path.join("./images", category, uid, "images")
      );
      const thumb = path.join(
        path.join("./images", category, uid, "thumb"),
        fs.readdirSync(path.join("./images", category, uid, "thumb"))[0]
      );

      const label = data.label;
      const imagesObj = {
        images: [],
        thumbnail: null,
      };
      const sub_category = data.category;
      for (const image of images) {
        imagesObj.images.push(
          uploadFromBuffer(
            fs.readFileSync(
              path.join("./images", category, uid, "images", image)
            ),
            cloudinary,
            category
          ).then((item) => {
            item["isMain"] = false;
            return item;
          })
        );

        imagesFinal.push(data);
      }
      imagesObj["thumbnail"] = uploadFromBuffer(
        fs.readFileSync(thumb),
        cloudinary,
        category
      ).then((item) => {
        item["isMain"] = true;
        return item;
      });
      imagesObj["images"] = await Promise.all(imagesObj["images"]);
      imagesObj["thumbnail"] = [await imagesObj["thumbnail"]];

      await category_master.model
        .query()
        .context({
          child: table_name,
          data: {
            label: label,
            parentId: uid,
            sub_category,
          },
        })
        .insert({
          category: table_name,
          label: label,
          uid: uid,
        });

      for (const image in imagesObj) {
        const curr = imagesObj[image];

        for (const img of curr) {
          const Images = require("./models/image/image").model;

          const insereted = await Images.query().insert({
            url: img.secure_url,
            width: img.width,
            main: img.isMain,
            height: img.height,
            parentId: uid,
            public_id: img.public_id,
          });
        }
      }
    }
    res.json("done");
  });
};
