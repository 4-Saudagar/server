const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/check", userController.checkLogin);
router.get("/google", userController.googleUser);
router.get("/regis", userController.userRegis);

module.exports = router;
