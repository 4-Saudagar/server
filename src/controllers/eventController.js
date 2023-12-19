const db = require("../models/db");
const { v4: uuid } = require("uuid");

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
      authorID = "001",
      image,
      location,
      title,
      ticket,
      description,
      rules,
      contact,
      dateStart,
      dateEnd,
    } = req.body;

    console.log(req.body);

    const eventID = uuid();

    const data = await db.events.doc(eventID).set({
      authorID: authorID,
      image: image,
      location: location,
      title: title,
      description: description,
      rules: rules,
      contact: contact,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });

    const promises = ticket.map(async (e) => {
      await db.tickets.doc(uuid()).set({
        eventID: eventID,
        nama: e.nama,
        harga: e.harga,
      });
    });

    await Promise.all(promises);

    return res.status(200).send({
      message: "SUCCESS ADD EVENT",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
};

const editEvent = async () => {};

module.exports = {
  getAllEvent,

  addEvent,
};
