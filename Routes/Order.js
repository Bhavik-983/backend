const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  CreateOrder,
  UpdateOreder,
  DeleteOrder,
  GetAllOrder,
  GetOrderByUser,
  cancelOreder,
  getOrderItems,
  getAllUserOrderByAdmin,
  getOrderByAdmin,
  // MonthlyIncome,
} = require("../Controller/Order");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyandAuthenticate,
  verifyTokenAndUser,
} = require("../Controller/Auth");
const { validationfield } = require("../Controller/Product");

router.post(
  "/CreateOrder/:userId",
  [
    check("Phone_number", "Phone number is required!").isLength({
      min: 1,
    }),
    check("address", "address is required!").isLength({
      min: 1,
    }),
  ],
  validationfield,
  verifyToken,
  CreateOrder
);
router.put(
  "/UpdateOreder/:orderId",
  // check("status", "status is required!").isLength({
  //   min: 1,
  // }),
  validationfield,
  verifyTokenAndAdmin,
  UpdateOreder
);
router.delete("/deleteorder/:orderId", verifyTokenAndAdmin, DeleteOrder);
router.get("/GetOrderByUser/:userId", verifyTokenAndUser, GetOrderByUser);
router.get("/GetOrdersByAdmin", verifyTokenAndAdmin, getAllUserOrderByAdmin);
router.get("/GetOrderByAdmin/:orderId", verifyTokenAndAdmin, getOrderByAdmin);
router.get("/GetAllOrder", verifyTokenAndAdmin, GetAllOrder);
router.delete(
  "/cancelorder/:userId/:orderId",
  verifyTokenAndUser,
  cancelOreder
);

// router.get("/GetMonthlyIncome", verifyTokenAndAdmin, MonthlyIncome);
// router.get("/GetOrderItemsByUser/:id", verifyandAuthenticate, getOrderItems);

module.exports = router;

// datas.product = i._id;
// datas.quantity = i.Stock;
// datas.price = i.price;
// datas.total = i.price * i.Stock;
// data.orederItems = orderItems;
// data.quantity = data.orederItems.length
// datas.price = i.price;
// datas.total = i.price * i.quantity;
// orderItems.push(datas);
