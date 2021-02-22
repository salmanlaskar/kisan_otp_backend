const logIt = require("../logger/logger");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const accountSid = require("../config/twilio.config").TWILIO_ACCOUNT_SID;
const authToken = require("../config/twilio.config").TWILIO_AUTH_TOKEN;
const sender = require("../config/twilio.config").TWILIO_SMS_SENDER;
const client = require("twilio")(accountSid, authToken);
exports.getMessage = (req, res) => {
  logIt.logIt("DEBUG", "GET /api/message");
  Message.find({})
    .lean()
    .then(async (data) => {
      let set = new Set();
      data.forEach((e) => {
        set.add(e.id.toString());
      });
      let users = await User.find({ _id: { $in: Array.from(set) } });
      let userMap = new Map(),
        tempUser = {};
      users.map((val) => {
        userMap.set(val._id.toString(), val);
      });
      res.send(
        data.map((e) => {
          tempUser = userMap.get(e.id);
          e.firstName = tempUser.firstName;
          e.lastName = tempUser.lastName;
          e.phoneNumber = tempUser.phoneNumber;
          return e;
        })
      );
    })
    .catch((e) => {
      logIt.logIt("ERROR", "GET /api/message : " + e);
      res.status(500).send({ message: "internal server error" });
    });
};
exports.sendMessage = async (req, res) => {
  logIt.logIt("DEBUG", "POST /api/message to id: " + req.body.id);
  const { otp, id, message } = req.body;
  const user = await User.findById(id).lean();
  const bodyData = "Hi. Your OTP is: " + otp + "\n" + message;
  client.messages
    .create({
      body: bodyData,
      from: sender,
      to: user.phoneNumber,
    })
    .then((message) => {
      console.log(message.sid);
      Message.create({
        message: bodyData,
        id,
        otp,
        receivedMessageTimeStamp: Date.now(),
      })
        .then((data) => {
          res.send({ message: "success" });
        })
        .catch((e) => {
          res.status(500).send({ message: "Internal server error" });
        });
    })
    .catch((e) => {
      logIt.logIt("ERROR", "POST /api/message : " + e);
      res.status(422).send({ message: "number invalid or not verified" });
    });
};
