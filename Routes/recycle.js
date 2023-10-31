const express = require("express");
const router = express.Router();
const fs = require("fs");
const { check } = require("express-validator");

const {
  createRecycleProduct,
  updatestatus,
  getStatus,
  deleteRecycleProduct,
  getRecycleOrder,
  cancelRecycleOrder,
  getRecycleOrderByAdmin,
  getRecycleOrdersByAdmin,
  updateRecycleOrderStatus,
} = require("../Controller/recycle.js");
const multer = require("multer");
const {
  verifyTokenAndAdmin,
  verifyandAuthenticate,
  verifyTokenAndUser,
  validationfield,
} = require("../Controller/Auth");
const { GetUser } = require("../Controller/User");

//all of params

//storage for photo
const diskstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/file/recycle");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: diskstorage });

router.post(
  "/recycle_p/:user_id/:product_id/:category_id",
  upload.single("recycle_product_image"),

  [
    // check("image", "image is required!"),
    // check("recycle_product_image", "Product name is required!").isLength({
    //   min: 1,
    // }),

    check("recycle_product_weight", "weight is required!").isLength({
      min: 1,
    }),
    // check("email", "email is required!").isLength({
    //   min: 1,
    // }),
    check("quantity", "quantity is required!").isLength({
      min: 1,
    }),

    check("Phone_number", "Phone number is required!").isLength({
      min: 1,
    }),
    check("address", "address is required!").isLength({
      min: 1,
    }),
  ],

  validationfield,
  verifyTokenAndUser,
  createRecycleProduct
);

// router.get("/getstatus/:product_id", updatestatus, getStatus);
// router.put("/updatestatus/:product_id", verifyTokenAndAdmin, updatestatus);

router.get("/getRecycleOrder/:userId", verifyTokenAndUser, getRecycleOrder);
router.get(
  "/GetRecycleOrdersByAdmin",
  verifyTokenAndAdmin,
  getRecycleOrdersByAdmin
);
router.put(
  "/updateStatus/:orderId",
  check("status", "status is required!").isLength({
    min: 1,
  }),
  validationfield,
  verifyTokenAndAdmin,
  updateRecycleOrderStatus
);

router.get(
  "/GetRecycleOrderByAdmin/:orderId",
  verifyTokenAndAdmin,
  getRecycleOrderByAdmin
);

router.delete(
  "/delete_Recycle_order/:userId/:orderId",
  verifyTokenAndUser,
  cancelRecycleOrder
);
router.delete(
  "/delete_Recycle_Product/:orderId",
  verifyTokenAndAdmin,
  deleteRecycleProduct
);

module.exports = router;
