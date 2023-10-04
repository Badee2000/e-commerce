const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/AppError");
const Category = require("../models/Category");
const slugify = require("slugify");

exports.getProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  if (products.length === 0) {
    res.status(200).json({
      status: "success",
      products: "No Products Available.",
    });
  } else {
    res.status(200).json({
      status: "success",
      products,
    });
  }
});
exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  // Needs optimization !!!.
  // Use only the product collection.
  const category = await Category.findOne({ name: req.params.categoryName });

  const features = new APIFeatures(
    Product.find({
      category: category,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const productsByCategory = await features.query;

  if (productsByCategory.length === 0) {
    res.status(200).json({
      status: "success",
      products: "No Products Available.",
    });
  } else {
    res.status(200).json({
      status: "success",
      productsByCategory,
    });
  }
});

exports.getProductsByName = catchAsync(async (req, res, next) => {
  // Needs optimization !!!.
  // Use only the product collection.
  const Name = slugify(req.params.productName, {
    lower: true,
    strict: true,
  });

  const features = new APIFeatures(
    Product.find({
      name: Name,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  if (products.length === 0) {
    res.status(200).json({
      status: "success",
      products: "No Products Available.",
    });
  } else {
    res.status(200).json({
      status: "success",
      products,
    });
  }
});
