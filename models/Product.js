const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us the product name!."],
  },
  price: {
    type: Number,
    required: [true, "Please tell us the product price!."],
  },
  description: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: ["Product must belong to a category!"],
  },
  quantity: {
    type: Number,
    required: ["true", "Please provide the available quantity!."],
  },
});

productSchema.pre("save", async function (next) {
  this.name = slugify(this.name, {
    lower: true,
    strict: true,
  });

  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
