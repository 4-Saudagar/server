const db = require("../models/db");

const schedule = async (req, res) => {
  try {
    const { email } = req.body;
    const date = new Date();
    const data = await db.user_ticket.where("email", "==", email).get();

    let allData = [];
    data.forEach((snapShot) => {
      allData.push({ id: snapShot.id, ...snapShot.data() });
    });

    const promises = allData.map(async (snapShot) => {
      const events = await db.events.doc(snapShot.eventID).get();
      console.log(events);

      if (
        events.data().dateEnd.slice(0, 10) >= date.toISOString().slice(0, 10)
      ) {
        return { id: snapShot.id, ...events.data() };
      }
    });

    const schedule = await Promise.all(promises);

    // console.log(schedule);
    // console.log(allData);
    res.status(200).send({ data: schedule });
  } catch (err) {
    res.status(500).send({ err: err.message });
    console.error(err);
  }
};

module.exports = { schedule };
