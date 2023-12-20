const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");

router.post("/add", partnerController.addPartners);
router.get("/all", partnerController.getAllPartners);
router.post("/allow-partner", partnerController.allowPartner);

module.exports = router;
