const Category = require("../Models/Category");
const { validationResult } = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not exists!",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  const existCategory = await Category.findOne({ name: req.body.name });
  if (existCategory) {
    return res.status(400).json({
      error: "This category already created!",
    });
  }

  const savedCategory = await category.save();
  return res
    .status(200)
    .json({ savedCategory, success: "Category created successfully" });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found!",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = async (req, res) => {
  try {
    const UpdateCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ UpdateCategory, success: "Category updated successfully" });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const deletecategory = await Category.findById(req.params.categoryId);
    if (!deletecategory) {
      return res.status(400).json({
        error: "Category not found!",
      });
    }
    deletecategory.delete();
    return res.status(200).json({
      success: "Category deleted successfully ",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
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
