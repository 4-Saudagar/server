const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/ticket", transactionController.transaction);

module.exports = router;
