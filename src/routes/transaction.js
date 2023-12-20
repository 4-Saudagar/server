const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const sendController = require("../controllers/email");
const notifyController = require("../controllers/notifController");
const scanTicket = require("../controllers/scanTicketController");
router.post("/ticket", transactionController.transaction);
router.post("/send-email", sendController.sendmail);
router.post("/notify", notifyController.notif);
router.post("/scan-ticket", scanTicket.scanTicket);
module.exports = router;
