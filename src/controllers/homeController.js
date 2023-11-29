const db = require("../models/db");

const getAllData = async (req, res) => {
  try {
    const data = await db.ads.get();
    let ads = [];
    data.forEach((snapshot) => {
      ads.push(snapshot.data());
    });

    const data2 = await db.events.get();
    let events = [];
    data2.forEach((snapshot) => {
      events.push(snapshot.data());
    });

    return res.status(200).send({
      status: 200,
      ads: ads,
      events: events,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllData,
};
