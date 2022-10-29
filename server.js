require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const routes = require('./Constants/routes');
const cors = require('cors')

app.use(express.json());
app.use(cors())

app.use(
  express.urlencoded({
    extended: true,
  })
);

const PORT = process.env.PORT;
app.get("/", async (req, res) => {
  res.send("************* WELCOME TO Image Downloading Server *************");
});

routes.map((item)=> app.use(item.path, item.route))

if (process.env.ENVIRONMENT === "Production") {
  var server = https.createServer(app);
  server.listen(PORT, () => {
    console.log("Server is up at :" + PORT);
  });
}

if (process.env.ENVIRONMENT === "Development") {
  var http = require("http").createServer(app);
  http.listen(PORT, () => {
    console.log("*******************************************");
    console.log(`port is listening on ${PORT}`);
  });

}