const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");
const notifyController = require("../controllers/notifController");

router.post("/add", partnerController.addPartners);
router.get("/all", partnerController.getAllPartners);
router.post("/allowPartner", partnerController.allowPartner);
router.post("/notify", notifyController.notif);

module.exports = router;
