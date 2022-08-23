let jwt = require("jsonwebtoken");
// let = require('../json');
let secretKey = "qwerty";
var mongoose = require("mongoose");
require("../model/User/user_session.model");
var userSession = mongoose.model("UserSession");

module.exports = {
  encrypt: function (req, user) {
    console.log("user", user);
    return new Promise((resolve, reject) => {
      userSession
        .updateMany({ userId: user._id }, { status: "deleted" }, { $new: true })
        .then((resSessionUpdate) => {
          var data = {
            userId: user._id,
            userAgent: req.get("User-Agent"),
          };
          var userSessionAdd = new userSession(data);
          user["sessionId"] = userSessionAdd._id;
          userSessionAdd.userToken = "JWT " + jwt.sign(user, secretKey);
          userSessionAdd
            .save()
            .then((resSession) => {
              resolve({
                token: resSession.userToken,
              });
            })
            .catch((error) => {
              log.debug(error);
              reject("SOMETHING_WENT_WRONG");
            });
        })
        .catch((error) => {
          console.log(error)
          reject("SOMETHING_WENT_WRONG");
        });
    });
  },
  decrypt: function (req, userToken) {
    return new Promise((resolve, reject) => {
      var userData = jwt.verify(userToken, secretKey);
      // console.log("userData", userData);
      userSession
        .findOne({
          _id: userData.sessionId,
          status: {
            $ne: "deleted",
          },
          userAgent: req.get("User-Agent"),
        })
        .then((resData) => {
          if (resData) {
            req["userId"] = userData._id;
            req["sessionId"] = userData.sessionId;
            req["role"] = userData.role;
            resolve();
          } else {
            reject("UNAUTHORIZED");
          }
        })
        .catch((error) => {
          log.error(error);
          reject("SOMETHING_WENT_WRONG");
        });
    });
  },
};
