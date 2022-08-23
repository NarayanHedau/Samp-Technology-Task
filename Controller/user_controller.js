let mongoose = require("mongoose");
require("../model/User/user.model");
let User = mongoose.model("User");

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  register: (data) => {
    return new Promise(async (resolve, reject) => {
      User.findOne({ email: data.email })
        .then((resUser) => {
          if (resUser) {
            reject("USER_ALREADY_REGISTERED");
          } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(data.password, salt, function (err, hash) {
                data["password"] = hash;
                var user = new User(data);
                user
                  .save()
                  .then((resData) => {
                    resolve(resData);
                  })
                  .catch((error) => {
                    console.log(error);
                    reject("SOMETHING_WENT_WRONG");
                  });
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
          reject("SOMETHING_WENT_WRONG");
        });
    });
  },

  login: (user) => {
    return new Promise((resolve, reject) => {
      var object = {};
      if (user.hasOwnProperty("email")) {
        object["email"] = user.email;
      }
      User.findOne({
        ...object,
        status: {
          $ne: "deleted",
        },
      })
        .then((resData) => {
          if (!resData) {
            reject("Please Enter Your valid email id");
          } else {
            bcrypt.compare(
              user.password,
              resData.password,
              function (err, result) {
                if (result) {
                  resolve(resData);
                } else {
                  reject("wrong password");
                }
              }
            );
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

};
