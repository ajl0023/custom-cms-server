const express = require("express");
const app = express();
const port = 3000;
const crypto = require("crypto");
const sharp = require("sharp");
var router = express.Router();
const fs = require("fs-extra");
const router2 = express.Router();
let streamifier = require("streamifier");
const path = require("path");

const cate = fs.readdirSync("./images/private_home");
for (const folder of cate) {
  const propertiesFolders = fs.readdirSync(
    path.join("./images/private_home", folder)
  );
  for (const property of propertiesFolders) {
    fs.copySync(
      path.join("./images/private_home", folder, property),
      path.join("./images/private_home", property)
    );
  }
}
