const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/all", eventController.getAllEvent);
router.get("/detail", eventController.getEventDetail);
router.post("/add", eventController.addEvent);

module.exports = router;
