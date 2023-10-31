const Product = require("../Models/Product");
const Category = require("../Models/Category");
const { validationResult } = require("express-validator");
const fs = require("fs");
const AWS = require("aws-sdk")


const awsConfig= {
  accessKeyId:process.env.Accesskey,
  secretKeyId:process.env.secretkey,
  region:process.env.region
}

const S3 = new AWS.S3(awsConfig)


const uploadS3 = (fileData) => {
 return new Promise((resolve,reject) => {
  const params = {
    Bucket:process.env.bucketName,
    Key:`${Date.now().toString()}.jpg`,
    Body: fileData
  }
  S3.upload(params,(err,data) => {
    if(err){
      // console.log(err);
      reject(err)
    }
    return resolve(data)
  })

 })
}
// Create product
exports.CreateProduct = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.file);
    if (!req.file.originalname) {
      return res.status(400).json({
        error: "Image must be required!",
      });
    }
    uploadS3(req.file.buffer)
    const categoryDetail = await Category.findOne({ _id: data.category });
    // let cateName = [];
    // await cateName.push(categoryDetail.name);
    // data.categories = cateName;
    // data.categoryId = data.category;

    data.image = req.file.filename;
    const newProduct = await new Product(data).save();
    return res.status(200).json(newProduct);
  } catch (err) {
    return res.status(200).json("Something went wrong");
  }
};

//Update produtc
exports.UpdateProduct = async (req, res) => {
  try {
    const data = req.body;
    const productDetails = await Product.findOne({
      _id: req.params.productId,
    });
    if (req.file) {
      const Path = productDetails.image;
      fs.unlink(`public/file/${Path}`, function (err) {
        if (err) {
          throw err;
        } else {
          console.log("File deleted!");
        }
      });
      productDetails.image = req.file.filename;
    }
    if (data.name) {
      productDetails.name = data.name;
    }
    if (data.description) {
      productDetails.description = data.description;
    }
 
    const findcategory = await Category.findOne({ _id: data.category });
    if (findcategory) {
      productDetails.categories = findcategory.name;
    }

    if (data.price) {
      productDetails.price = data.price;
    }
    if (data.recycle_product_price) {
      productDetails.recycle_product_price = data.recycle_product_price;
    }
    if (data.recycle_product_weight) {
      productDetails.recycle_product_weight = data.recycle_product_weight;
    }
    if (data.Stock) {
      productDetails.Stock = data.Stock;
    }

    await productDetails.save();
    // return res.status(200).json(productDetails);
    return res
      .status(200)
      .json({ productDetails, success: "Product Updated successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

//Delete product
exports.DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({
      _id: req.params.productId,
    });
    if (!product) {
      return res.status(403).json("Product not found");
    }
    if (product.image) {
      const Path = product.image;
      fs.unlink(`public/file/${Path}`, function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
    }

    return res.status(200).json({ success: "Product deleted successfully" });
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
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
//Get Product
exports.GetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json(err, "Sommething went wrong");
  }
};

//Get All Products
exports.GetAllProducts = async (req, res) => {
  try {
    const qName = req.query.qname;

    //for name releted find
    const productsByName = await Product.find({ name: qName }).sort({
      createdAt: -1,
    });
    if (!productsByName) {
      return res.status(400).json({
        error: "Product Not found!",
      });
    }

    if (productsByName.length > 0) {
      return res.status(200).json(productsByName);
    }

    //by category wise find
    const productByCategory = await Product.find({
      categories: { $in: [qName] },
    }).sort({
      createdAt: -1,
    });
    if (productByCategory.length > 0) {
      return res.status(200).json(productByCategory);
    }

    //by price
    const productByPrice = await Product.find({
      price: qName,
    }).sort({
      createdAt: -1,
    });
    if (productByPrice.length > 0) {
      return res.status(200).json(productByPrice);
    }
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json(products);

    // const qCategory = req.query.category;
    // const qprice = req.query.qprice;
    // const qpriceless = req.query.priceless;
    // const qpricemore = req.query.pricemore;
    // const qname = req.query.qname;

    // if (qCategory) {
    //   options.categories = { $in: [qCategory] };
    // }
    // if (qprice) {
    //   options.price = qprice;
    // }

    // if (qname) {
    //   options.name = qname;
    // }
    // if (qpriceless) {
    //   options.price = {
    //     $lte: qpriceless,
    //   };
    // }
    // if (qpricemore) {
    //   options.price = {
    //     $gte: qpricemore,
    //   };
    // }
  } catch (err) {
    return res.status(400).json(err, "something went wrong");
  }
};
// price with product
// price less with product
// price more with product
// price category  product

// exports.CreateProduct = async (req, res) => {
//   const product = await Product.create(req.body);
//   res.status(201).json({
//     success: true,
//     product,
//   });
// };
// exports.upload = multer({
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload a valid image file"));
//     }
//     cb(undefined, true);
//   },
// });

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found!",
        });
      }
      req.product = product;
      next();
    });
};

// Get Wooden produtc
exports.getAllWoodenProduct = async (req, res) => {
  try {
    const woodenProduct = await Product.find({
      categoryId: req.params.categoryId,
    });
    if (!woodenProduct) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    return res.status(200).json(woodenProduct);
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.getAllIronProduct = async (req, res) => {
  try {
    const woodenProduct = await Product.find({});
    const category = woodenProduct[0].categories.toString();

    if (!woodenProduct) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    if (category === "iron") {
      return res.status(200).json(woodenProduct);
    }
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

// exports.getAllPlasticProduct = async (req, res) => {
//   try {
//     const woodenProduct = await Product.find({});
//     const category = woodenProduct[0].categories.toString();

//     if (!woodenProduct) {
//       return res.status(400).json({
//         : "Product not found",
//       });
//     }
//     if (category === "plastic") {
//       return res.status(200).json(woodenProduct);
//     }
//   } catch (err) {
//     return res.status(400).json({
//       error: "Something went wrong",
//     });
//   }
// };

// exports.getAllPaperProduct = async (req, res) => {
//   try {
//     const woodenProduct = await Product.find({});
//     const category = woodenProduct[0].categories.toString();

//     if (!woodenProduct) {
//       return res.status(400).json({
//         error: "Product not found",
//       });
//     }
//     if (category === "paper") {
//       return res.status(200).json(woodenProduct);
//     }
//   } catch (err) {
//     return res.status(400).json({
//       error: "Something went wrong",
//     });
//   }
// };

// exports.getAllClothProduct = async (req, res) => {
//   try {
//     const woodenProduct = await Product.find({});
//     const category = woodenProduct[0].categories.toString();

//     if (!woodenProduct) {
//       return res.status(400).json({
//         error: "Product not found",
//       });
//     }
//     if (category === "cloth") {
//       return res.status(200).json(woodenProduct);
//     }
//   } catch (err) {
//     return res.status(400).json({
//       error: "Something went wrong",
//     });
//   }
// };
