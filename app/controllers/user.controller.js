const logIt = require("../logger/logger");
const User = require("../models/user.model");
exports.getUsers = (req, res) => {
  logIt.logIt("DEBUG", "GET /api/user");
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      logIt.logIt("ERROR", "GET /api/user : " + e);
      res.status(500).send({ message: "internal server error" });
    });
};
exports.createUser = async (req, res) => {
  logIt.logIt("DEBUG", "POST /api/user with phone number: "+req.body.phoneNumber);
  User.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
        logIt.logIt("ERROR", "POST /api/user : " + e);
      res.status(500).send({ message: "Internal server error" });
    });
};
