// const jwt = require("jsonwebtoken");
// const config = require("./config.json");
// module.exports = {
//   verify: async (req, res, next) => {
//     try {
//       const header = req.headers.authorization;
//       const token = header.split(" ")[1];
//       const isVerified = jwt.verify(token, config.jwt_secret);
//       console.log("IsVerified", isVerified);
//       if (isVerified) {
//         next();
//       } else {
//         return res.status(401).json({
//           message: "Unauthorized access.",
//         });
//       }
//     } catch (error) {
//       res.status(401).json({
//         message: "Invalid Token",
//       });
//     }
//   },
// };

// const jwt = require("jsonwebtoken");
// let secretKey = "qwerty";
// module.exports = {
//   verify: async (req, res, next) => {
//     try {
//       const header = req.headers.authorization;
//       const token = header.split(" ")[1];
//       const isVerified = jwt.verify(token, secretKey);
//       if (isVerified) {
//         next();
//       } else {
//         return res.status(401).json({
//           message: "Unauthorized access.",
//         });
//       }
//     } catch (error) {
//       res.status(401).json({
//         message: "Invalid Token",
//       });
//     }
//   },
// };

let tokens = require("./Controller/token_controller");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  } else {
    var authHeader = req.headers.authorization;
    // console.log("authHeader", req.headers.authorization);
    if (authHeader && req.headers.authorization.includes("JWT ")) {
      const token = authHeader.split("JWT ")[1];
      tokens
        .decrypt(req, token)
        .then((resData) => {
          next();
        })
        .catch((error) => {
          res.status(401).json({
            message: "Unauthorized access.1111111111",
          });
        });
    } else {
       res.status(401).json({
        message: "Unauthorized access.",
      });
    }
  }
};
