const category = "commercial";
const table = "commercials";
const data = parseJSON(fs.readFileSync(`./images/${category}-full.json`));
const thumbs = data[category].thumbs;
const propertyImages = data[category].properties;

const inserted = [];
for (const key in propertyImages) {
  if (Object.hasOwnProperty.call(propertyImages, key)) {
    const images = propertyImages[key].images;
    for (const image of images.splice(0, 1)) {
      const imageBuffer = await downloadImage(image.url);
      const metaData = await sharp(imageBuffer).metadata(imageBuffer);
      let compressed;
      if (metaData.width >= 950) {
        compressed = await sharp(imageBuffer).resize({ width: 900 }).toBuffer();
      } else {
        compressed = await sharp(imageBuffer).toBuffer();
      }
      console.log(image.label);
      const uploaded_file = await uploadFromBuffer(compressed);
      const uuid = crypto.randomUUID();
      // try {
      //   await CategoryMaster.query()
      //     .context({
      //       label: image.label,
      //       thumbnail: uploaded_file.secure_url,
      //     })
      //     .insert({
      //       category: table,
      //       label: image.label,
      //       uid: uuid,
      //     });
      //   await Images.query().insert({
      //     url: uploaded_file.url,
      //     width: uploaded_file.width,
      //     height: uploaded_file.height,
      //     parentId: uuid,
      //     main: false,
      //   });
      //   inserted.push({
      //     old: image.key,
      //     new: uuid,
      //   });
      // } catch (error) {
      //   console.log(error);
      //   res.json("error").status(500);
      //   return;
      // }
    }
  }
}
// for (const thumb of thumbs) {
//   const parentId = inserted.find((item) => {
//     return item.old === thumb.key;
//   });
//   const uploaded_file = await uploadFromBuffer(
//     await downloadImage(thumb.url)
//   );
//   await Images.query().insert({
//     url: uploaded_file.url,
//     width: uploaded_file.width,
//     height: uploaded_file.height,
//     parentId: parentId.new,
//     main: true,
//   });
// }
res.json("sdf");
