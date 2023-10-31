const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },

    price: {
      type: Number,
      required: true,
      maxLength: 6,
    },
    recycle_product_price: {
      type: Number,
      required: true,
    },
    recycle_product_weight: {
      type: Number,
      required: true,
    },
    Stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        review: String,
      },
    ],

    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    // createdBy: {
    //   type: mongoose.Schema.ObjectId,y
    //   ref: "User",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
