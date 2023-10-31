const express = require("express");
const router = express.Router();
const fs = require("fs");
const { check } = require("express-validator");
const dotenv = require("dotenv")
dotenv.config()
const {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct,
  GetAllProducts,
  validationfield,
  getProductById,
  getAllWoodenProduct,
  getAllIronProduct,
  getAllPlasticProduct,
  getAllPaperProduct,
  getAllClothProduct,
} = require("../Controller/Product");
const multer = require("multer");
const {
  verifyTokenAndAdmin,
  verifyandAuthenticate,
} = require("../Controller/Auth");
const { GetUser } = require("../Controller/User");
//all of params
// router.param("userId", GetUser);
// router.param("/product/productId", GetProduct);


//storage for photo
// const upload = multer(
//   ({
//     destination: function (req, file, cb) {
//       cb(null, "./public/file");
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   })
// );
const upload = multer({
  limits:1024*1024*5,
  fileFilter:function(req,file,done){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
      done(null , true)
    }else{
      done("file not supported" , false)

    }
  }
})
// const upload = multer({ storage: diskstorage });
// fs.unlink("./public/file", function (err) {
//   if (err) throw err;
//   console.log("File deleted!");
// });
router.post(
  "/product",
  upload.single("image"),

  [
    // check("image", "image is required!"),

    // check("name", "Product name is required!").isLength({ min: 1 }),
    // check("price", "price is required!").isLength({
    //   min: 1,
    // }),
    // check("recycle_product_price", "recycleprice is required!").isLength({
    //   min: 1,
    // }),

    // check("recycle_product_weight", "weight is required!").isLength({
    //   min: 1,
    // }),

    // check("category", "category is required!").isLength({
    //   min: 1,
    // }),
    // check("Stock", "Stock is required!").isLength({
    //   min: 1,
    // }),
    // check("description", "description is required!").isLength({
    //   min: 1,
    // }),
  ],
  // validationfield,
  // verifyTokenAndAdmin,
  CreateProduct
);
router.put(
  "/updateProduct/:productId/:userId",
  upload.single("image"),
  verifyTokenAndAdmin,
  UpdateProduct
);

upload.single("image"),
  router.delete(
    "/DeleteProduct/:userId/:productId",
    verifyTokenAndAdmin,
    DeleteProduct
  );
router.get("/GetProduct/:productId/:userId", verifyTokenAndAdmin, GetProduct);
router.get("/GetAllProducts", GetAllProducts);
router.get("/getAllWoodenProduct/:categoryId", getAllWoodenProduct);
// router.get("/getAllIronProduct", getAllIronProduct);
// router.get("/getAllPlasticProduct", getAllPlasticProduct);
// router.get("/getAllPaperProduct", getAllPaperProduct);
// router.get("/getAllClothProduct", getAllClothProduct);

module.exports = router;
