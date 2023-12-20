const db = require("../models/db");

const history = async (req, res) => {
  try {
    const { userID } = req.body;
    const data = await db.transaction.where("userID", "=", userID).get();

    const history = [];
    data.forEach((snapshot) => {
      history.push({ id: snapshot.id, ...snapshot.data() });
    });

    res.status(200).send({
      data: history,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { history };
