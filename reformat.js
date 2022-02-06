const fs = require("fs-extra");
const { parseJSON } = require("./utils");
const path = require("path");
const category = "furniture";
const data = parseJSON(
  fs.readFileSync(path.join("./images", `${category}-full.json`))
);
const final = {};
const properties = data;

fs.writeFileSync(`./images/${category}.json`, JSON.stringify(final));
