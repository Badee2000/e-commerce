const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const express = require("express");

const router = express.Router();

router.post("/addOrder", authController.protect, orderController.addOrder);
router.delete(
  "/cancelOrder/:id",
  authController.protect,
  orderController.cancelOrder
);

router.get("/getOrders", authController.protect, orderController.getOrders);

module.exports = router;
