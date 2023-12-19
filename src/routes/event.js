const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { route } = require("./ads");

router.get("/all", eventController.getAllEvent);
router.post("/add", eventController.addEvent);
router.post("/all-my", eventController.getAuthorEvent);
router.post("/edit", eventController.editEvent);

module.exports = router;
