module.exports = (app) => {
  const message = require("../controllers/message.controller");

  var router = require("express").Router();

  router.post("/", message.sendMessage);
  router.get("/", message.getMessage);
  app.use("/api/message", router);
};
