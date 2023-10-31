const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  Signup,
  Signin,
  validationfield,
  isAdmin,
  isUser,
  resetpassword,
  forgotPassword,
  resetPassword,
} = require("../Controller/Auth");

// router.post("/Signup", Signup);
// router.post("/Signin", Signin);

// const validaterequest = [
//   check("firstname").notEmpty().withMessage("firstname is required"),
//   check("lastname").notEmpty().withMessage("lastname is required"),
// ];

router.post(
  "/Signup",
  Signup
);

router.post(
  "/isUser/Signin",
  [
    check("email", "email is required!").isEmail(),
    check("password", "password field is required!").isLength({ min: 1 }),
  ],
  validationfield,
  isUser,
  Signin
);

// Admin Signin
router.post(
  "/isAdmin/Signin",
  [
    check("email", "email is required!").isEmail(),
    check("password", "password field is required!").isLength({ min: 1 }),
  ],

  validationfield,
  isAdmin,
  Signin
);

//demo
router.post(
  "/Signin",
  [
    check("email", "email is required!").isEmail().isLength({
      min: 2,
    }),
    check("password", "password field is required!").isLength({ min: 1 }),
  ],
  validationfield,
  Signin
);

//forgot password
router.put(
  "/forgotPassword",

  [
    check("currentemail", "email is required!").isEmail().isLength({
      min: 2,
    }),
    check("secretKey", "secretKey is required!").isLength({ min: 1 }),
    check(
      "newpassword",
      "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character! "
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
    check("confirmPassword", "confirmPassword is required!").isLength({
      min: 1,
    }),
  ],
  validationfield,
  forgotPassword
);

//reset password
router.put(
  "/resetPassword/:userId",

  [
    check("Password", "Password is required!").isLength({
      min: 1,
    }),
    check(
      "newPassword",
      "Password at least 8 character and At least one uppercase,one lower case,one special character! "
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),

    check("confirmPassword", "Confirm password is required!").isLength({
      min: 1,
    }),
  ],
  validationfield,
  resetPassword
);

module.exports = router;
