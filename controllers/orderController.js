const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");

exports.addOrder = catchAsync(async (req, res, next) => {
  const orderedProducts = req.body.product;
  const originalQuantities = {}; // Store original quantities

  for (const productId of orderedProducts) {
    // Check if product quantity is available
    const product = await Product.findById(productId);
    if (product.quantity <= 0) {
      // Restore original quantities
      for (const [id, quantity] of Object.entries(originalQuantities)) {
        const originalProduct = await Product.findById(id);
        originalProduct.quantity += quantity;
        await originalProduct.save();
      }

      return res.status(400).json({
        status: "fail",
        message: `Product with ID ${productId} is out of stock or you orderd more than the available quantity!.`,
      });
    }

    // Store original quantity
    if (!originalQuantities[productId])
      originalQuantities[productId] = product.quantity;

    // Reduce the quantity by one
    product.quantity -= 1;
    await product.save();
  }

  // Create the order
  const order = await Order.create({
    user: req.user._id,
    product: orderedProducts,
  });

  res.status(201).json({
    status: "success",
    order,
  });
});

/// Show only the user's orders.
exports.getOrders = catchAsync(async (req, res, next) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    passwordChangedAt: req.user.passwordChangedAt,
  };
  const features = new APIFeatures(Order.find({ user: user }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const orders = await features.query;
  // console.log(orders);
  res.status(200).json({
    status: "success",
    orders,
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: "Order deleted successfully",
  });
});
