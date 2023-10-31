const User = require("../Models/User");
const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
// USER SIGNUP
exports.Signup = async (req, res) => {
  try {
    const existuser = await User.findOne({ email: req.body.email });
    if (existuser) {
      return res.status(400).json({
        error: "user already exist",
      });
    }
    let secret = uuidv4();
    let newSecret = secret.substring(1, 11);
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      password_Secret: newSecret,
    });
    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: req.body.email, // Change to your recipient
      from: process.env.SG_MAIL, // Change to your verified sender
      subject:
        "keep this secret,this secret required if you forgot your password",
      html: `<strong>${newSecret}</strong>`,
    };
    await sgMail
      .send(msg)
      .then(response => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch(error => {
        console.error(error);
      });
    const SavedUser = await newUser.save();

    // return res.status(200).json(SavedUser);
    return (
      res
        .status(200)
        // .json({ SavedUser, success: "Your account created suucessfully" });
        .json({
          SavedUser,
          success: "Your account created successfully",
        })
    );
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    const finddata = await User.findOne({ email: req.body.email });
    if (!finddata) {
      return res.status(401).json({
        error: "User not found!",
      });
    }
    if (finddata.isAdmin) {
      next();
    } else {
      return res.status(400).json({
        error: "You are not admin!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

//isUser
exports.isUser = async (req, res, next) => {
  try {
    const finddata = await User.findOne({ email: req.body.email });
    if (!finddata) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    if (!finddata.isAdmin) {
      next();
    } else {
      return res.status(400).json({
        error: "You are not user!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong1",
    });
  }
};

// USER SIGNIN
exports.Signin = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.body.email },
      {
        email: 1,
        firstname: 1,
        lastname: 1,
        password: 1,
        isAdmin: 1,
      }
    );

    if (!user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    // const hash = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    // const Originalpassword = hash.toString(CryptoJS.enc.Utf8);

    const Originalpassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // data.password = req.body.password

    // const hash = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    // const Originalpassword = hash.toString(CryptoJS.enc.Utf8);
    if (!Originalpassword) {
      return res.status(400).json({ error: "Password invalid!" });
    }

    const token = await jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC
      // { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    // return res.json({});
    return res
      .status(200)
      .json({ ...others, status: 200, token, success: "Login successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "somthing went wrong",
    });
  }
};

// VERIFY TOKEN
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Token is not valid",
        });
      }
      req.user = user;

      next();
    });
  } else {
    return res.status(401).json({
      error: "You are not authenticated!",
    });
  }
};

// AUTHENTICATION
exports.verifyandAuthenticate = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        error: "You are not alowed to do that!",
      });
    }
  });
};

// VERIFY TOKEN AND ADMIN
exports.verifyTokenAndAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: "You are not alowed to do that!" });
    }
  });
};

exports.validationfield = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()[0].msg,
    });
  }
  next();
};

exports.verifyTokenAndUser = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.isAdmin === false) {
      next();
    } else {
      return res.status(403).json({
        err: "You are not user.",
      });
    }
  });
};

exports.forgotPassword = async (req, res) => {
  const data = req.body;
  const findUser = await User.findOne({ email: data.currentemail });
  if (!findUser) {
    return res.status(400).json({
      err: "user not found",
    });
  }

  // const isPasswordValid = await bcrypt.compareSync(
  //   data.old_Password,
  //   findUser.password
  // );
  if (data.secretKey !== findUser.password_Secret) {
    return res.status(400).json({
      error: "Secret is invalid!",
    });
  }
  if (data.newpassword !== data.confirmPassword) {
    return res.status(400).json({
      error: "Password must be same!",
    });
  }

  // data.password = req.body.password
  findUser.password = await bcrypt.hashSync(data.newpassword, 10);
  const saveNewPassword = await findUser.save();
  return res
    .status(200)
    .json({ saveNewPassword, success: "Pssword set successfully" });
};

exports.resetPassword = async (req, res) => {
  const data = req.body;
  const findUser = await User.findById(req.params.userId);
  if (!findUser) {
    return res.status(400).json({
      err: "user not found",
    });
  }
  const isPasswordValid = await bcrypt.compareSync(
    data.Password,
    findUser.password
  );
  if (!isPasswordValid) {
    return res.status(400).json({
      error: "Password invalid!",
    });
  }

  if (data.newPassword !== data.confirmPassword) {
    return res.status(400).json({
      error: "NewPassword and confirm password must be same!",
    });
  }
  findUser.password = await bcrypt.hashSync(data.confirmPassword, 10);
  const saveNewPassword = await findUser.save();
  // return res.status(200).json(saveNewPassword);
  return res
    .status(200)
    .json({ saveNewPassword, success: "Pssword reset successfully" });
};

// exports.isAdmin = async (req, res, next, user) => {
//   try {
//     const isAdmin = await User.findOne({ isAdmin: true });
//     if (isAdmin) {
//       next();
//     } else {
//       return res.status(403).json("You are not admin");
//     }
//   } catch (error) {
//     return res.status(400).json({
//       error: "Something went wrong",
//     });
//   }
// };
