const db = require("../models/db");

const scanTicket = async (req, res) => {
  try {
    const { token } = req.body;
    await db.user_ticket.doc(token).update({
      arrival: true,
    });

    res.status(200).send({
      message: "USER ARRIVED",
    });
  } catch (err) {
    res.status(404).send({
      message: "TOKEN NOT FOUND",
    });
  }
};

module.exports = { scanTicket };
