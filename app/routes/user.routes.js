module.exports = (app) => {
    const user = require("../controllers/user.controller");
  
    var router = require("express").Router();
  
    router.post("/", user.createUser);
    router.get("/", user.getUsers);
    app.use("/api/user", router);
  };
  