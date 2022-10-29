const imageDownloader = require("node-image-downloader");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const upload_dir = path.dirname(require.main.filename) + "/downloads";


let hashed_array = [];

// const compare_images = async (filename1) => {
//   const image1 = await jimp.read(filename1);
//   // hashing images

//   const hash1 = image1.hash();

//   hashed_array.push(hash1);
//   // console.log(hashed_array);
// };

// compare_hash = async (fileName) => {
//   const image_to_hash = await jimp.read(fileName);

//   const hasehed_img = image_to_hash.hash();
//   const filtered_img_hash = hashed_array.filter(
//     (found_hash) => hasehed_img === found_hash
//   );
//   // console.log(filtered_img_hash)
//   if (filtered_img_hash.length > 2) {
//     console.log("same images");
//   }
// };

const image_downloader = async (links_array, res) => {
console.log(upload_dir)

  try {
    if (!fs.existsSync(upload_dir )) {
      fs.mkdir(path.join(upload_dir), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });
    }
    let img_path_array = [];
    for (const url of links_array) {
      await imageDownloader({
        imgs: [
          {
            uri: url,
            filename: `${new Date().getTime()}`,
          },
        ],
        dest: "./downloads", //destination folder
      })
        .then((info) => {
          // console.log(info)
        })
        .catch((error, response, body) => {
          console.log("something goes bad!");
          res.status(400).send({
            status: "failed",
            message: error.message
          })
        });

      // Check Images for Same Hash.

      // img_path_array.forEach((item) => {
      //   console.log(item);
      //   compare_hash(item)
      //     .then((result) => {
      //       // console.log(result);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // });
    }
    res.status(200).send({
      status: "success",
      message: "Images are downloaded in Downloads folder"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: error.message
    })
  }
};

module.exports = image_downloader;
