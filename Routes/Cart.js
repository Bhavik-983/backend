const express = require("express");
const router = express.Router();

const {
  CreateCart,
  UpdateCart,
  DeleteCart,
  GetCart,
  GetAllCart,
  deleteCart,
  Quantity,
  increaseQuantity,
} = require("../Controller/Cart");
const {
  verifyToken,
  verifyandAuthenticate,
  verifyTokenAndAdmin,
  verifyTokenAndUser,
} = require("../Controller/Auth");

router.post("/CreateCart/:userId/:productId", verifyTokenAndUser, CreateCart);
// router.put("/UpdateCart", verifyandAuthenticate, UpdateCart);
router.delete("/deleteCart/:userId/:productId", verifyTokenAndUser, deleteCart);
router.get("/GetCart/:userId", GetCart);
// router.put("/increase/:cartId/:productId", increaseQuantity);
router.put("/decrease/:userId/:cartId/:productId", Quantity);

// router.get("/GetAllCart", verifyTokenAndAdmin, GetAllCart);

module.exports = router;

// exports.CreateCart = async (req, res) => {
//   try {
//     // find product
//     console.log(req.params);
//     const product = await Product.findOne({ _id: req.body.product });
//     if (!product) {
//       return res.status(400).json({
//         error: "product not exist",
//       });
//     }

//     // cart find exist or not

//     const cart = await Cart.findOne({ user: req.user.id });
//     // add product in cart
//     if (cart) {
//       let indexOf = -1;
//       for (let index = 0; index < cart.cartItems.length; index++) {
//         const product_data = cart.cartItems[index];
//         if (String(product_data.product) === String(req.body.product)) {
//           indexOf = index;
//           break;
//         }
//       }

//       indexOf !== -1
//         ? ((cart.cartItems[indexOf].quantity =
//             1 + cart.cartItems[indexOf].quantity),
//           (cart.cartItems[indexOf].price =
//             cart.cartItems[indexOf].quantity * product.price))
//         : cart.cartItems.push({
//             product: req.body.product,
//             quantity: 1,
//             price: 1 * product.price,
//           });

//       await cart.save();
//       return res.status(200).json(cart);
//     }
//     // if cart not found then create cart
//     else {
//       const cart = await new Cart({
//         user: req.user.id,
//         cartItems: [
//           {
//             product: req.body.product,
//             quantity: 1,
//             price: 1 * product.price,
//           },
//         ],
//       }).save();

//       console.log(cart);
//       return res.status(200).json(cart);
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err, "Something went wrong");
//   }
// };
//   try {
//     find product
//     console.log(req.params);
//     const product = await Product.findOne({ _id: req.params.productid });
//     if (!product) {
//       return res.status(400).json({
//         error: "product not exist",
//       });
//     }

//     cart find exist or not
//     console.log(req.user.id);

//     const cart = await Cart.findOne({ user: req.user.id });
//     console.log(cart);
//     add product in cart
//     console.log("cart is", cart);
//     if (cart) {
//       let indexOf = -1;
//       for (let index = 0; index < cart.cartItems.length; index++) {
//         const product_data = cart.cartItems[index];
//         if (String(product_data.product) === String(req.body.product)) {
//           indexOf = index;
//           break;
//         }
//       }

//       indexOf !== -1
//         ? ((cart.cartItems[indexOf].quantity =
//             req.body.quantity + cart.cartItems[indexOf].quantity),
//           (cart.cartItems[indexOf].price =
//             (req.body.quantity + cart.cartItems[indexOf].quantity) *
//             product.price))
//         : cart.cartItems.push({
//             product: req.body.product,
//             quantity: req.body.quantity,
//             price: req.body.quantity * product.price,
//           });

//       await cart.save();
//       return res.status(200).json(cart);
//     }
//     if cart not found then create cart
//     else {
//       console.log("hyyyy");

//       const cart = await new Cart({
//         user: req.user.id,
//         cartItems: [
//           {
//             product: req.params.productid,
//             quantity: req.body.quantity,
//             price: req.body.quantity * product.price,
//           },
//         ],
//       }).save();

//       console.log(cart);
//       return res.status(200).json(cart);
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err, "Something went wrong");
//   }
// };
