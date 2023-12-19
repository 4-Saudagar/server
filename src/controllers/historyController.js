const db = require("../models/db");

const history = async (req, res) => {
  const { userID } = req.body;
  const data = await db.transaction.where("userID", "=", userID).get();

  const history = [];
  data.forEach((snapshot) => {
    history.push({ id: snapshot.id, ...snapshot.data() });
  });
};

module.exports = { history };
