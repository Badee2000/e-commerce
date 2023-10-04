const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Category = require("../models/Category");
const APIFeatures = require("../utils/apiFeatures");

// Get all categories.
exports.getCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query;
  res.status(200).json({
    status: "success",
    categories,
  });
});

// exports.getCategoryProducts = catchAsync(async (req, res, next) => {
//   const categories = await Category.find({name:req.body.name}).populate("products");

//   res.status(200).json({
//     status: "success",
//     category,
//   });
// });
