const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const historyController = require("../controllers/historyController");
const scheduleController = require("../controllers/scheduleController");
router.get("/check", userController.checkLogin);
router.get("/google", userController.googleUser);
router.get("/regis", userController.userRegis);
router.get("/history", historyController.history);
router.get("/schedule", scheduleController.schedule);

module.exports = router;
