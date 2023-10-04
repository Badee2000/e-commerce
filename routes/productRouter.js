const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router.get(
  "/getProducts",
  authController.protect,
  productController.getProducts
);
router.get(
  "/getProducts/byCategory/:categoryName",
  authController.protect,
  productController.getProductsByCategory
);
router.get(
  "/getProducts/byName/:productName",
  authController.protect,
  productController.getProductsByName
);

module.exports = router;
