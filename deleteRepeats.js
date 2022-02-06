const fs = require("fs-extra");
const { parseJSON } = require("./utils");
const path = require("path");
const category = "concept";
const dir = fs.readdirSync(path.join("./images", category));
const final = {};

for (const folder of dir) {
  const images = fs.readdirSync(
    path.join("./images", category, folder, "images")
  );
  const assets = fs.readdirSync(
    path.join("./images", category, folder, "thumb")
  );
  const findRepeat = images.find((item) => {
    return item === assets[0];
  });
  fs.rmSync(path.join("./images", category, folder, "images", findRepeat));
}
