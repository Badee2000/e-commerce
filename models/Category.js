const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide the category name!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
});

categorySchema.pre("save", async function (next) {
  this.name = slugify(this.name, {
    lower: true,
    strict: true,
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
