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
      date,
      image,
      location,
      price,
      title,
      description,
      rules,
      contact,
      ticketType,
    } = req.body;

    console.log(req.body.body);

    const data = await db.events.doc().set({
      authorID: authorID,
      date: date,
      image: image,
      location: location,
      price: price,
      title: title,
      description: description,
      rules: rules,
      contact: contact,
      dateStart: dateStart,
      dateEnd: dateEnd,
      ticketType: ticketType,
    });

    return res.status(200).send({
      message: "SUCCESS ADD EVENT",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllEvent,

  addEvent,
};
