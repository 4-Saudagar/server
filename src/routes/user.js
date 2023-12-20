const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const historyController = require("../controllers/historyController");
const scheduleController = require("../controllers/scheduleController");
router.get("/check", userController.checkLogin);
router.get("/google", userController.googleUser);
router.get("/regis", userController.userRegis);
router.post("/history", historyController.history);
router.post("/schedule", scheduleController.schedule);

module.exports = router;
