const User = require("../Models/User");
const CryptoJS = require("crypto-js");
// const router = require("../Routes/Auth");
// const { verifyandAuthenticate } = require("./Auth");
// const { findByIdAndDelete, find } = require("../Models/User");

// UPDATE USER
exports.Update = async (req, res) => {
  try {
    data = req.body;

    const updatedUser = await User.findOne({ _id: req.params.id });
    if (data.firstname) {
      updatedUser.firstname = data.firstname;
    }
    if (data.lastname) {
      updatedUser.lastname = data.lastname;
    }
    if (data.email) {
      updatedUser.email = data.email;
    }
    if (data.Phone_number) {
      updatedUser.Phone_number = data.Phone_number;
    }
    if (!data.firstname) {
      updatedUser.firstname = updatedUser.firstname;
    }
    if (!data.lastname) {
      updatedUser.lastname = updatedUser.lastname;
    }
    if (!data.email) {
      updatedUser.email = updatedUser.email;
    }
    if (!data.Phone_number) {
      updatedUser.Phone_number = updatedUser.Phone_number;
    }
    // if (!data.token) {
    //   updatedUser.token = updatedUser.token;
    // }
    updatedUser.save();
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETE USER BY ADMIN
exports.Delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User already deleted!" });
    }
    return res.status(200).json("User deleted successfully.");
  } catch (err) {
    return res.status(500).json("Something went wrong", err);
  }
};

// DELETE USER BY ADMIN
// exports.Deleteuserbyadmin = async (req, res) => {
//   try {
//     const Admin = await User.findOne({ isAdmin: true });
//     if (req.params.id === Admin.id) {
//       const user = await User.findByIdAndDelete(req.body.userId);
//       !user && res.status(200).json("User not found");
//       return res.status(200).json("User deleted successfully");
//     }
//   } catch (err) {
//     return res.status(500).json("Something went wrong");
//   }
// };

//  GET USER BY ADMIN
exports.GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json("Something went wrong");
  }
};

// GET ALL USER BY ADMIN
exports.GetAllUser = async (req, res) => {
  try {
    const user = await User.find({ isAdmin: false });
    if (!user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("Something went wrong");
  }
};

//DELETE USER ACCOUNT
// exports.DeleteAccount = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete({ isAdmin: false });
//     if (!user) {
//       return res.status(400).json({
//         error: "Please enter valid details",
//       });
//     }
//     return res.status(200).json("Your Account has Deleted Successfully");
//   } catch (err) {
//     return res.status(200).json("Something went wrong..");
//   }
// };

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account!",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store thi in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
