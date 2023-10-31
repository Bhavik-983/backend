const Order = require("../Models/Order");
const User = require("../Models/User");
const Cart = require("../Models/Cart");
const { findOne } = require("../Models/User");

//Create Order
exports.CreateOrder = async (req, res) => {
  try {
    if (req.body.order_payment_type === "COD") {
      const userDetails = await User.findById(req.params.userId);
      if (!userDetails) {
        return res.status(400).json({
          error: "You are not exists in this site!",
        });
      }
      // const orderemail = req.body.email;
      // if (userDetails.email !== orderemail) {
      //   return res.status(400).json({
      //     error: "Email must be same",
      //   });
      // }

      const data = {
        address: req.body.address,
        // email: req.body.email,
        Phone_number: req.body.Phone_number,
        user: req.params.userId,
        order_date: new Date(),
        orderStatus: "Pending...",
        order_payment_type: "COD",
      };
      const Cartdata = await Cart.findOne({ user: req.params.userId });
      let CartItems = Cartdata.cartItems;
      let orderItems = [];
      let datas = {};
      for (let i of CartItems) {
        datas.product = i.product;
        datas.quantity = i.quantity;
        datas.price = i.price;
        datas.Sub_total = i.Sub_total;
        orderItems.push(datas);
        data.orederItems = orderItems;
        datas = {};
      }
      data.Total = 0;
      data.Total = Cartdata.Total;

      const order = await Order(data).save();
      const deleteCartData = await Cart.findOne({ user: req.params.userId });

      if (deleteCartData) {
        deleteCartData.cartItems = [];
        await Cart(deleteCartData).save();
      }
      if (order) {
        return res.status(200).json({
          data: order,
        });
      }
      return res.status(400).json({
        success: "Order created successfully",
      });
    }
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Get Order
exports.GetOrderByUser = async (req, res) => {
  try {
    const getOrder = await Order.find({
      user: req.params.userId,
      orderStatus: { $ne: "Cancel" },
    }).populate("orederItems.product", "name price image");

    if (!getOrder) {
      return res.status(400).json({
        error: "Order not found!",
      });
    }

    return res.status(200).json(getOrder);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

exports.cancelOreder = async (req, res) => {
  try {
    const deleteOrder = await Order.findById(req.params.orderId);
    if (!deleteOrder || deleteOrder.orderStatus === "Cancel") {
      return res.status(400).json({
        message: "Order not found",
      });
    }

    const todayDate = new Date();

    const orderDate = deleteOrder.order_date;

    if (
      todayDate.getTime() / 1000 / 60 / 60 / 24 <=
      orderDate.getTime() / 1000 / 60 / 60 / 24 + 24
    ) {
      deleteOrder.orderStatus = "Cancel";
      deleteOrder.save();
      return res.status(200).json({
        message: "Your Order Cancel Successfully",
      });
    } else {
      return res.status(400).json({
        error: "You can not cancel this order",
      });
    }

    // return res.status(400).json({
    //   error: "You can not cancel this order",
    // });
  } catch (e) {
    return res.status(400).json({
      error: "something gone wrong",
    });
  }
};

//getUserOrder
exports.getAllUserOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.find({}).populate("user", "firstname");
    if (!order) {
      return res.status(400).json({
        error: "Order not found!",
      });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json("Something went wrong");
  }
};

exports.getOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId }).populate(
      "orederItems.product",
      "name price image"
    );
    if (!order) {
      return res.status(400).json({
        error: "Order not found",
      });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json("Something went wrong");
  }
};

//Update Order
exports.UpdateOreder = async (req, res) => {
  try {
    // if(req.body)
    const body = req.body.status;
    const getOrder = await Order.findOne({ _id: req.params.orderId });
    if (!getOrder) {
      return res.status(400).json({
        error: "Order not found!",
      });
    }
    if (getOrder.orderStatus === body) {
      return res.status(400).json({
        error: "status already exist!",
      });
    }
    const array = [
      "Pending...",
      "Ready...",
      "On The Way...",
      "Delivered",
      "Cancel",
    ];
    if (!array.includes(body)) {
      return res.status(400).json({ error: "order status is not valid!" });
    }
    if (getOrder.orderStatus === array[4]) {
      return res.status(400).json({ error: "order is already cancel!" });
    }
    if (body) {
      getOrder.orderStatus = body;
    }

    // if (getOrder.orderStatus === body) {
    //   return res.status(400).json({ success: "already status is exists" });
    // }

    await getOrder.save();
    return res.status(200).json(getOrder);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Delete Order
exports.DeleteOrder = async (req, res) => {
  try {
    const deleteorder = await Order.findByIdAndDelete({
      _id: req.params.orderId,
    });
    return res.status(200).json({ success: "Order deleted successfully" });
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};
exports.deleteRecycleProduct = async (req, res) => {
  try {
    if (req.body.product_id) {
      const findproduct = await Order.findOneAndDelete({
        _id: req.body.product_id,
      });

      if (!findproduct) {
        return res.status(400).json({
          error: "Recycle order not found!",
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
      error: "Something went wrong",
    });
  }
};

//Get All Order
exports.GetAllOrder = async (req, res) => {
  try {
    const GetOrder = await find({ userId: req.params.id });
    return res.status(200).json(GetOrder);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Monthly Income
exports.MonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "#createAt" },
          sales: "$amount",
        },

        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(200).json(income);
  } catch (err) {
    return res.json(err, "Something went wrong");
  }
};
