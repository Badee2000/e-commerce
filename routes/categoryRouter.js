const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");

const express = require("express");

const router = express.Router();

router.get(
  "/getCategories",
  authController.protect,
  categoryController.getCategories
);

module.exports = router;
