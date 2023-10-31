const express = require("express");
const { verifyTokenAndAdmin } = require("../Controller/Auth");
const router = express.Router();
const { check } = require("express-validator");

const {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
  getCategoryById,
  validationfield,
} = require("../Controller/Category");
const { GetUser } = require("../Controller/User");

router.param("userId", GetUser);
router.param("categoryId", getCategoryById);

router.post(
  "/AddCategory",
  [
    check("name", "Category name required!").isLength({
      min: 1,
    }),
  ],
  validationfield,
  verifyTokenAndAdmin,
  createCategory
);

router.get("/categories", getAllCategory);

router.put(
  "/category/:categoryId",
  [
    check("name", "Category name required!").isLength({
      min: 1,
    }),
  ],
  validationfield,
  verifyTokenAndAdmin,
  updateCategory
);

router.delete(
  "/deletecategory/:categoryId",
  verifyTokenAndAdmin,
  removeCategory
);
router.get("/category/:categoryId", verifyTokenAndAdmin, getCategory);

module.exports = router;

//read

//update

//delete
