const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  verifyandAuthenticate,
  verifyTokenAndAdmin,
  verifyTokenAndUser,
  validationfield,
} = require("../Controller/Auth");
const {
  Update,
  Delete,
  GetUser,
  GetAllUser,
  DeleteAccount,
  userPurchaseList,
  resetpassword,
} = require("../Controller/User");
router.param("userId", GetUser);
validationfield,
  router.put(
    "/edituser/:id",

    verifyandAuthenticate,
    Update
  );
router.delete("/Delete/:id", verifyTokenAndAdmin, Delete);
router.get("/find/:id", verifyTokenAndAdmin, GetUser);
router.get("/getAllUser", verifyTokenAndAdmin, GetAllUser);
// router.delete("/DeleteByUser/:id", DeleteAccount);
router.get("/orders/user/:userId", verifyandAuthenticate, userPurchaseList);

module.exports = router;
