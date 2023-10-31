const { default: mongoose } = require("mongoose");
const {
  findByIdAndUpdate,
  findByIdAndDelete,
  findOne,
} = require("../Models/Cart");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const Product = require("../Models/Product");
const { findById } = require("../Models/User");

exports.CreateCart = async (req, res) => {
  try {
    // find product
    const product = await Product.findOne({ _id: req.params.productId });
    if (!product) {
      return res.status(400).json({
        error: "product not exist!",
      });
    }

    // cart find exist or not

    const cart = await Cart.findOne({ user: req.user.id });
    // add product in cart
    if (cart) {
      let indexOf = -1;
      for (let index = 0; index < cart.cartItems.length; index++) {
        const product_data = cart.cartItems[index];
        if (String(product_data.product) === String(req.params.productId)) {
          indexOf = index;
          break;
        }
      }

      indexOf !== -1
        ? ((cart.cartItems[indexOf].quantity =
            1 + cart.cartItems[indexOf].quantity),
          (cart.cartItems[indexOf].Sub_total =
            cart.cartItems[indexOf].quantity * product.price))
        : cart.cartItems.push({
            product: req.params.productId,
            quantity: 1,
            price: product.price,
            Sub_total: 1 * product.price,
          });

      const mainTotal = cart.cartItems;
      cart.Total = 0;
      for (let i of mainTotal) {
        cart.Total = cart.Total + i.Sub_total;
      }

      await cart.save();
      return res
        .status(200)
        .json({ cart, success: "Product added succefully in cart" });
    }
    // if cart not found then create cart
    else {
      const cart = await new Cart({
        user: req.user.id,
        cartItems: [
          {
            product: req.params.productId,
            quantity: 1,
            price: product.price,
            Sub_total: 1 * product.price,
          },
        ],
      }).save();

      const mainTotal = cart.cartItems;
      cart.Total = 0;
      for (let i of mainTotal) {
        cart.Total = cart.Total + i.Sub_total;
      }

      await cart.save();
      return res
        .status(200)
        .json({ cart, success: "Product added succefully in cart" });
    }
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

exports.Quantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(400).json({
        error: "This Product is Invalid!",
      });
    }

    // const index = cart.cartItems.findIndex(
    //   obj =>
    //     mongoose.Types.ObjectId(obj.product) ===
    //     mongoose.Types.ObjectId(req.params.productId)
    // );
    let array = [];
    const data = cart.cartItems;
    for (let i of data) {
      const main = i.product.equals(
        mongoose.Types.ObjectId(req.params.productId)
      );
      array.push(main);
    }

    const index = array.indexOf(true);

    if (index !== -1) {
      if (cart.cartItems[index].quantity > 1) {
        cart.cartItems[index].quantity = cart.cartItems[index].quantity - 1;
        cart.cartItems[index].Sub_total =
          cart.cartItems[index].price * cart.cartItems[index].quantity;
      } else {
        return res.status(400).json({
          error: "quantity is not exist",
        });
      }
    } else {
      return res.status(400).json({
        error: "product not found!",
      });
    }
    const mainTotal = cart.cartItems;
    cart.Total = 0;
    for (let i of mainTotal) {
      cart.Total = cart.Total + i.Sub_total;
    }
    await cart.save();
    // await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(400).json({
        error: "This Product is Invalid!",
      });
    }

    // const index = cart.cartItems.findIndex(
    //   obj => toString(obj.product) === toString(req.params.productId)
    // );

    if (index !== -1) {
      if (cart.cartItems[index].quantity > 0) {
        cart.cartItems[index].quantity = cart.cartItems[index].quantity + 1;
        cart.cartItems[index].Sub_total =
          cart.cartItems[index].price * cart.cartItems[index].quantity;
      } else {
        return res.status(400).json({
          error: "quantity is not exist",
        });
      }
    } else {
      return res.status(400).json({
        error: "product not found!",
      });
    }
    const mainTotal = cart.cartItems;
    cart.Total = 0;
    for (let i of mainTotal) {
      cart.Total = cart.Total + i.Sub_total;
    }
    await cart.save();
    // await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

//Get Cart
exports.GetCart = async (req, res) => {
  try {
    const Getcart = await Cart.findOne({ user: req.params.userId }).populate(
      "cartItems.product",
      "name  image description Stock"
    );
    if (!Getcart) {
      return res.status(400).json({
        error: "Your cart is empty!",
      });
    }
    return res.status(200).json(Getcart);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Update Cart
exports.UpdateCart = async (req, res) => {
  try {
    const updatecart = await Cart.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.status(200).json(updatecart);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Delete Cart
exports.deleteCart = async (req, res) => {
  try {
    const deleteCart = await Cart.findOne({ user: req.params.userId });
    if (!deleteCart) {
      return res.status(400).json({
        error: "Your cart is empty!",
      });
    }

    let dataItems = deleteCart.cartItems;
    let array = [];
    let products = mongoose.Types.ObjectId(req.params.productId);
    for (let i of dataItems) {
      const main = i.product.equals(products);
      array.push(main);
    }

    const index = array.indexOf(true);
    if (index === -1) {
      return res.status(400).json({ error: "product not exists!" });
    }

    let Total = dataItems[index].Sub_total;
    deleteCart.Total = deleteCart.Total - Total;
    const result = dataItems.splice(index, 1);
    deleteCart.dataItems = result;
    await deleteCart.save();
    return res.status(200).json({
      success: "Cart deleted successfully",
    });
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};

//Get All Cart
exports.GetAllCart = async (req, res) => {
  try {
    const Getcart = await Cart.find();
    !Getcart && res.status(400).json("Cart not found.");
    return res.status(200).json(Getcart);
  } catch (err) {
    return res.status(400).json(err, "Something went wrong");
  }
};
