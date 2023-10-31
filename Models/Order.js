const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    order_date: {
      type: Date,
      default: new Date(),
    },
    Total: {
      type: Number,
      default: 0,
    },
    orederItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          // required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        Sub_total: {
          type: Number,
          default: 0,
        },
      },
    ],

    // orederItems: [
    //   {
    //     name: {
    //       type: String,
    //     },
    //     price: {
    //       type: Number,
    //       required: true,
    //     },
    //     quantity: {
    //       type: Number,
    //       default: 0,
    //     },
    //     product: {
    //       type: mongoose.Schema.ObjectId,
    //       ref: "Product",
    //       required: true,
    //     },
    //   },
    // ],

    // shippingPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },

    address: {
      type: String,
      required: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    // },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending...", "Ready...", "On The Way...", "Delivered", "Cancel"],
    },
    ComplateStatus: {
      type: Array,
    },
    quantity: {
      type: Number,
    },
    Phone_number: {
      type: Number,
    },
    order_payment_type: {
      type: "String",
      enum: ["COD", "STRIPE"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

// const ProductCartSchema = new mongoose.Schema({
//   product: {
//     type: ObjectId,
//     ref: "Product"
//   },
//   name: String,
//   count: Number,
//   price: Number
// });

// const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

// const OrderSchema = new mongoose.Schema(
//   {
//     products: [ProductCartSchema],
//     transaction_id: {},
//     amount: { type: Number },
//     address: String,
//     updated: Date,
//     user: {
//       type: ObjectId,
//       ref: "User"
//     }
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", OrderSchema);

// module.exports = { Order, ProductCart };
