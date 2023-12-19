const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const sendController = require("../controllers/email");

router.post("/ticket", transactionController.transaction);
router.post("/send-email", sendController.sendmail);
module.exports = router;
