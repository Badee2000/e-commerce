const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

//AUTH:
router.post("/signUp", authController.signUp);
router.get("/logIn", authController.login);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword
);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//USER:

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

module.exports = router;
