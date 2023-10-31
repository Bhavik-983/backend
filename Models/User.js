const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxLength: 20,
      trim: true,
      min: 2,
      max: 22,
    },
    lastname: {
      type: String,
      maxLength: 20,
      trim: true,
      min: 2,
      max: 22,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    old_Password: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    Phone_number: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    password_Secret: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

// const User = require("../Models/User");
// const CryptoJS = require("crypto-js");
// var jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator");

// // USER SIGNIN
// exports.Signin = async (req, res) => {
//   try {
//     const user = await User.findOne(
//       { email: req.body.email },
//       {
//         email: 1,
//         username: 1,
//         password: 1,
//       }
//     );
//     if (!user) {
//       return res.status(401).json("User not found.");
//     }

//     const hash = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
//     const Originalpassword = hash.toString(CryptoJS.enc.Utf8);

//     if (Originalpassword !== req.body.password) {
//       return res.status(400).json("Password invalid.");
//     }

//     const Token = await jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "3d" }
//     );

//     const { password, ...others } = user._doc;

//     return res.json({ ...others, status: 200, Token });
//   } catch (err) {
//     return res.status(500).json({
//       message: "somthing gone wrong",
//     });
//   }
// };

// // VERIFY TOKEN
// exports.verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.token;
//     if (authHeader) {
//       const token = authHeader.split(" ")[1];
//       jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
//         if (err) {
//           if (String(err).includes("jwt malformed")) {
//             return res.status(401).json("token is not malformed");
//           } else if (String(err).includes("jwt expired")) {
//             return res.status(401).json("token is expired");
//           }
//           return res.status(403).json("Token is not valid");
//         }
//         const userDetail = await User.findOne({ _id: user.id });
//         req.user = userDetail;
//         next();
//       });
//     } else {
//       return res.status(401).json("You are not authenticated.");
//     }
//   } catch (e) {
//     return res.status(401).json(e);
//   }
// };

// // AUTHENTICATION
// // exports.verifyandAuthenticate = (req, res, next) => {
// //   exports.verifyToken(req, res, () => {
// //     if (req.user.id === req.params.id || req.user.isAdmin) {
// //       next();
// //     } else {
// //       return res.status(403).json("You are not alowed to do that.");
// //     }
// //   });
// // };

// // VERIFY TOKEN AND ADMIN
// exports.verifyTokenAndAdmin = async (req, res, next) => {
//   try {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       return res.status(403).json("You are not alowed to do that.");
//     }
//   } catch (error) {
//     return res.status(403).json(error);
//   }
// };

// exports.validationfield = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       error: errors.array()[0].msg,
//     });
//   }
//   next();
// };
