const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

//User:
router.get(
  "/getusers",
  authController.protect,
  authController.restrictTo("admin"),
  adminController.getUsers
);

//Category:
router.post(
  "/addCategory",
  authController.protect,
  authController.restrictTo("admin"),
  adminController.addCategory
);
router.delete(
  "/deleteCategory/:categoryId",
  authController.protect,
  authController.restrictTo("admin"),
  adminController.deleteCategory
);

//Product:
router.post(
  "/addProduct",
  authController.protect,
  authController.restrictTo("admin"),
  adminController.addProduct
);

router.delete(
  "/deleteProduct/:productId",
  authController.protect,
  authController.restrictTo("admin"),
  adminController.deleteProduct
);

module.exports = router;
