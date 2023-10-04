const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user!."],
    },
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Order must have a product at least!."],
      },
    ],
    //Add quantity and price.
    createdAt: {
      type: Date,
      select: false,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name address -_id -passwordChangedAt",
  }).populate({
    path: "product",
    select: "name price -_id",
  });
  next();
});
orderSchema.pre("save", function (next) {
  next();
});

orderSchema.virtual("totalPrice").get(function () {
  let totalPrice = 0;
  if (this.product && this.product.length > 0) {
    totalPrice = this.product.reduce(
      (total, product) => total + product.price,
      0
    );
  }
  return totalPrice;
});
orderSchema.virtual("numberOfProducts").get(function () {
  return this.product.length;
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
