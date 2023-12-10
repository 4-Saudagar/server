const db = require("../models/db");

const getAllEvent = async (req, res) => {
  try {
    const data = await db.events.get();
    let events = [];
    data.forEach((snapshot) => {
      events.push({ id: snapshot.id, ...snapshot.data() });
    });
    return res.status(200).send({
      status: 200,
      data: events,
    });
  } catch (err) {
    console.log(err);
  }
};

const addEvent = async (req, res) => {
  try {
    const {
      authorID = "",
      eventName,
      contactPerson,
      image,
      location,
      eventRules,
      eventDescription,
      eventStart,
      eventEnd,
    } = req.body;

    console.log(req.body.body);

    const data = await db.events.doc().set({
      authorID: authorID,
      eventName: eventName,
      contactPerson: contactPerson,
      image: image,
      location: location,
      eventRules: eventRules,
      eventDescription: eventDescription,
      eventStart: eventStart,
      eventEnd: eventEnd,
    });

    return res.status(200).send({
      message: "SUCCESS ADD EVENT",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllEvent,

  addEvent,
};
