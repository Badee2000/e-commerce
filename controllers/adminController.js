const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});
//Category:
exports.addCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    category,
  });
});
exports.deleteCategory = catchAsync(async (req, res, next) => {
  await Category.findOneAndDelete({
    _id: req.params.categoryId,
  });

  res.status(200).json({
    status: "success",
    category: "Category Deleted.",
  });
});

//Product:
exports.addProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findOneAndDelete({ _id: req.params.productId });

  res.status(201).json({
    status: "success",
    product: "Product Deleted.",
  });
});
