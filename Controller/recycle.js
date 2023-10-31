const User = require("../Models/User");
const Product = require("../Models/Product");
const Category = require("../Models/Category");
const RecycleProduct = require("../Models/recycle");
const Order = require("../Models/Order");

exports.createRecycleProduct = async (req, res) => {
  try {
    let data = req.body;
    if (!req.file.originalname) {
      return res.status(400).json({
        error: "Image must be required!",
      });
    }
    const user = await User.findOne({ _id: req.params.user_id });
    if (!user) {
      return res.status(400).json(err, "You are not exist in this site! ");
    }

    // if (data.email !== user.email) {
    //   return res.status(400).json({
    //     error: "email must be same!",
    //   });
    // }
    const product = await Product.findOne({ _id: req.params.product_id });
    if (!product) {
      return res.status(400).json(err, "This Product is not exist! ");
    }
    const category = await Category.findOne({ _id: req.params.category_id });
    if (!category) {
      return res.status(400).json(err, "category not found!");
    }
    data.Total = 0;
    data.recycle_product_image = req.file.filename;
    data.category = category._id;
    data.user_Id = user._id;
    data.product_name = product._id;
    data.recycle_product_price = product.recycle_product_price;
    data.Total = data.quantity * product.recycle_product_price;
    if (data.recycle_product_weight <= product.recycle_product_weight) {
      data.recycle_product_weight = product.recycle_product_weight;
    }
    const recycleProduct = await new RecycleProduct(data).save();
    return res
      .status(200)
      .json({ recycleProduct, success: "Order posted successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.getRecycleProduct = async (req, res) => {
  try {
    if (req.body.product_id) {
      const findproduct = await RecycleProduct.findOne({
        _id: req.body.product_id,
      }).populate({ name: "category" });

      if (!findproduct) {
        return res.status(400).json({
          error: "Recycle product not found!",
        });
      }

      return res.status(200).json(findproduct);
    }
    const findallproduct = await RecycleProduct.find({});

    if (!findallproduct) {
      return res.status(400).json({
        error: "Something error...!",
      });
    }

    return res.status(200).json(findallproduct);
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.getRecycleOrder = async (req, res) => {
  try {
    const getRecycleOrder = await RecycleProduct.find({
      user_Id: req.params.userId,
      status: { $ne: "Cancel" },
    }).populate("product_name", "image name price");
    if (!getRecycleOrder) {
      return res.status(400).json({
        error: "Order not exists!",
      });
    }

    return res.status(200).json(getRecycleOrder);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

exports.getRecycleOrdersByAdmin = async (req, res) => {
  try {
    const getRecycleOrders = await RecycleProduct.find({}).populate(
      "user_Id",
      "firstname email"
    );
    if (!getRecycleOrders) {
      return res.status(400).json({
        error: "Order not exists!",
      });
    }
    return res.status(200).json(getRecycleOrders);
  } catch (err) {
    return res.status(500).json("Something went wrong");
  }
};

exports.getRecycleOrderByAdmin = async (req, res) => {
  try {
    const getRecycleOrder = await RecycleProduct.findOne({
      _id: req.params.orderId,
    }).populate("product_name", "image name  price");
    if (!getRecycleOrder) {
      return res.status(400).json({
        error: "Order not exists!",
      });
    }
    return res.status(200).json(getRecycleOrder);
  } catch (err) {
    return res.status(500).json("Something went wrong");
  }
};

exports.cancelRecycleOrder = async (req, res) => {
  try {
    const deleteOrder = await RecycleProduct.findById(req.params.orderId);
    if (!deleteOrder || deleteOrder.status === "Cancel") {
      return res.status(400).json({
        message: "Order not exists!",
      });
    }
    const todayDate = new Date();
    const orderDate = deleteOrder.order_date;

    if (
      todayDate.getTime() / 1000 / 60 / 60 / 24 <=
      orderDate.getTime() / 1000 / 60 / 60 / 24 + 24
    ) {
      deleteOrder.status = "Cancel";
      deleteOrder.save();
      return res.status(200).json({
        message: "Your Order Cancel Successfully",
      });
    }
    return res.status(400).json({
      error: "You can not cancel this order",
    });
  } catch (e) {
    return res.status(400).json({
      error: "something gone wrong",
    });
  }
};

//Update Order
exports.updateRecycleOrderStatus = async (req, res) => {
  try {
    const body = req.body.status;
    const getOrder = await RecycleProduct.findOne({ _id: req.params.orderId });

    if (!getOrder) {
      return res.status(400).json({
        error: "Order not found!",
      });
    }
    if (getOrder.status === body) {
      return res.status(400).json({
        error: "status already exist",
      });
    }

    const array = ["Pending...", "Approve...", "Ready...", "Placed", "Cancel"];

    if (getOrder.status === array[4])
      return res.status(400).json({ message: "order is already cancel" });
    if (!array.includes(body))
      return res.status(400).json({ message: "order status is not valid" });

    getOrder.status = body;
    await getOrder.save();
    return res.status(200).json(getOrder);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};
//Get recycle order by user
// exports.GetRecycleOrderByUser = async (req, res) => {
//   try {
//     const finduser = await Order.findOne({ user_Id: req.params.id });
//     if (!finduser) {
//       return res.status(400).json({
//         error: "User not found",
//       });
//     }
//     const getOrder = await Order.find({ user_Id: req.params.id });
//     if (!getOrder) {
//       return res.status(400).json({
//         error: "Order not found",
//       });
//     }

//     return res.status(200).json(getOrder);
//   } catch (err) {
//     return res.status(400).json(err, "Something went wrong");
//   }
// };

exports.getStatus = async (req, res) => {
  try {
    if (!req.product) {
      return res.status(400).json({
        error: "Recycle product not found!",
      });
    }
    if (req.product.status === "pending...") {
      return res.status(200).json({
        message: "your order is pending...",
      });
    }
    if (req.product.status === "approve") {
      return res.status(200).json({
        message: "your order successfully",
      });
    }
    if (req.product.status === "complate") {
      return res.status(200).json({
        message: "your product is ready for dispatch",
      });
    }
    if (req.product.status === "placed") {
      return res.status(200).json({
        message: "your product is placed successfully",
      });
    }
    if (req.product.status === "Cancel") {
      return res.status(200).json({
        message: "your order not possible",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
};

exports.updatestatus = async (req, res, next) => {
  try {
    const findproduct = await RecycleProduct.findByIdAndUpdate(
      {
        _id: req.params.product_id,
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (findproduct) {
      req.product = findproduct;
      next();
    }
    return res.status(200).json(findproduct);
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
};

exports.deleteRecycleProduct = async (req, res) => {
  try {
    if (req.params.product_id) {
      const findproduct = await RecycleProduct.findOneAndDelete({
        _id: req.params.product_id,
      });

      if (!findproduct) {
        return res.status(400).json({
          error: "Recycle product not found!",
        });
      }

      return res.status(200).json({
        message: "product deleted successfully",
      });
    }
    const findallproductanddelete = await RecycleProduct.find({});

    if (!findallproductanddelete) {
      return res.status(400).json({
        error: "Something error...!",
      });
    }

    return res.status(200).json({
      message: "Successfully deleted all recycle product",
    });
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
};
