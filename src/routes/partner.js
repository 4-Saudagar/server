const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");

router.post("/add", partnerController.addPartners);
router.post("/all", partnerController.getAllPartners);

module.exports = router;
