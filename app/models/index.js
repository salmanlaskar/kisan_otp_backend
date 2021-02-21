const mongodbConfig = require("../config/mongo.config.js");
const mongoose = require("mongoose");

mongoose
  .connect(mongodbConfig.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected successfully to MongoDB");
  });
