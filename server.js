const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const basicAuth = require("express-basic-auth");
require("dotenv").config({ path: __dirname + "/../kisan.env" });

//Middleware
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./app/models");

//Basic authentication setup
app.use(
  basicAuth({
    authorizer: (username, password, cb) => {
      const userMatches = basicAuth.safeCompare(
        username,
        process.env.AUTH_USERNAME
      );
      const passwordMatches = basicAuth.safeCompare(
        password,
        process.env.AUTH_PASSWORD
      );
      if (userMatches & passwordMatches) return cb(null, true);
      else return cb(null, false);
    },
    authorizeAsync: true,
    unauthorizedResponse: (req) => {
      return `unauthorized. ip: ${req.ip}`;
    },
    challenge: true,
  })
);

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
