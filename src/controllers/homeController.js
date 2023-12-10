const db = require("../models/db");

const getAllData = async (req, res) => {
  try {
    const data = await db.ads.get();
    let ads = [];
    data.forEach((snapshot) => {
      ads.push({ id: snapshot.id, ...snapshot.data() });
    });

    const data2 = await db.events.get();

    let events = [];

    const promises = data2.docs.map(async (snapshot) => {
      const event = { ...snapshot.data() };
      const partner = await db.partners.doc(event.authorID).get();

      return {
        author: { ...partner.data() },
        id: snapshot.id,
        ...event,
      };
    });

    events = await Promise.all(promises);

    return res.status(200).send({
      status: 200,
      ads: ads,
      events: events,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllData,
};
