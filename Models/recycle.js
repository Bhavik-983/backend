const mongoose = require("mongoose");
const recycleSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    product_name: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    user_Id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    recycle_product_image: {
      type: String,
    },
    Total: {
      type: Number,
      default: 1,
    },
    recycle_product_price: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    recycle_product_weight: {
      type: Number,
      required: true,
    },
    order_date: {
      type: Date,
      default: new Date(),
    },
    address: {
      type: String,
      required: true,
    },
    Phone_number: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending...", "Approve...", "Ready...", "Placed", "Cancel"],
      default: "Pending...",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecycleProduct", recycleSchema);
