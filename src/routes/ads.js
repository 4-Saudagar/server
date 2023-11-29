const express = require("express");
const router = express.Router();
const adsController = require("../controllers/adsController");

router.get("/all", adsController.getAllAds);
router.post("/add", adsController.addAds);

module.exports = router;
