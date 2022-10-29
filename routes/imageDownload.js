const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");
const image_downloader = require("./services");
const cors = require('cors')

router.post("/", cors(), async (req, res) => {
  try {
    console.log("api hit sucessfully");
    const domain = req.body.domain;
    request(domain, (err, resp, data) => {    // Requesting html data from the Entered Domain.
      if (err) throw err;
      else {
        let links_array = [];
        var cherio = cheerio.load(data);

        // TRAVERSING all the img tags that is available of webpage.
        cherio("img").each((index, image) => {
          var img_url = cherio(image).attr("src");

          // VALIDATION if image src links alrady have domain Name 
          // and filtering same links if more then once

          if (img_url.substring(0, 5) === "https") {
            const found_link = links_array.find(
              (found_link) => img_url === found_link
            );
            if (!found_link) {
              links_array.push(img_url);
            //   image_downloader(img_url)
            }
          } else {
            const found_link = links_array.find(
              (found_link) => img_url === found_link
            );
            if (!found_link) {
              links_array.push(domain + img_url);
            }
          }
        });
        // Image download function in SERVICES.JS file 
        if(links_array.length > 0){
          image_downloader(links_array, res)
        }
        else{
          res.status(200).send({
            status: "success",
            message: "No image found to download."
          })
        }
      }
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = router;
