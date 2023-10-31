// return res.status(200).json({ message: cart });
// const product = req.body.cartItems.product;
// const isItemAdded = await cart.cartItems.find(
//   (c) => c.product == product
// );
// if (isItemAdded) {
//   await Cart.findOneAndUpdate(
//     { user: req.user._id, "cartItems.product": product },
//     {
//       $set: {
//         cartItems: {
//           ...req.body.cartItems,
//           quantity: item.quantity + req.body.cartItems.quantity,
//         },
//       },
//     }
//   ).exec((error, _cart) => {
//     if (error) {
//       return res.status(400).json({ error });
//     }
//     if (cart) {
//       return res.status(200).json({ cart: _cart });
//     }
//   });
// } else {
//   Cart.findOneAndUpdate(
//     { user: req.user._id },
//     {
//       $push: {
//         cartItems: req.body.cartItems,
//       },
//     }
//   ).exec((error, _cart) => {
//     if (error) {
//       return res.status(400).json({ error });
//     }
//     if (cart) {
//       return res.status(200).json({ cart: _cart });
//     }
//   });
// }

// cart.save((error, cart) => {
//   if (error) {
//     return res.status(400).json({ error });
//   }
//   if (cart) {
//     return res.status(200).json({ cart });
//   }
// });
exports.CreateCart = async (req, res) => {
    try {
      //find product
      const product = await Product.findOne({ _id: req.body.product });
      if (!product) return res.status(400).json("product not exixts");
  
      //cart find exist or not
      const cart = await Cart.findOne({ user: req.user.id });
  
      //add product in cart
      if (cart) {
        let indexOf = -1;
        for (let index = 0; index < cart.cartItems.length; index++) {
          const product_data = cart.cartItems[index];
          if (String(product_data.product) === String(req.body.product)) {
            console.log("yes");
            indexOf = index;
            break;
          }
        }
  
        indexOf !== -1
          ? ((cart.cartItems[indexOf].quantity =
              req.body.quantity + cart.cartItems[indexOf].quantity),
            (cart.cartItems[indexOf].price =
              (req.body.quantity + cart.cartItems[indexOf].quantity) *
              product.price))
          : cart.cartItems.push({
              product: req.body.product,
              quantity: req.body.quantity,
              price: req.body.quantity * product.price,
            });
  
        await cart.save();
        return res.status(200).json(cart);
      }
      //if cart not found then create cart
      else {
        const cart = await new Cart({
          user: req.user.id,
          cartItems: [
            {
              product: req.body.product,
              quantity: req.body.quantity,
              price: req.body.quantity * product.price,
            },
          ],
        }).save();
        return res.status(200).json(cart);
      }
    } catch (err) {
      return res.status(400).json(err, "Something went wrong");
    }
  };