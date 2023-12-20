const db = require("../models/db");

const schedule = async (req, res) => {
  try {
    const { userID } = req.body;
    const date = new Date();
    const data = await db.user_ticket
      .where("userID", "=", userID)
      .where("dateEnd", ">", date.toString())
      .get();

    const schedule = [];
    data.forEach((snapShot) => {
      schedule.push({ id: snapShot.id, ...snapShot.data() });
    });
    res.status(200).send({ data: schedule });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

module.exports = { schedule };
