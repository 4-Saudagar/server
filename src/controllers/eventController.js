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

const getEventDetail = async (req, res) => {
  try {
    const { id } = req.body;
    const event = await db.events.doc(id).get();

    return res.status(200).send({
      status: 200,
      data: event.data(),
    });
  } catch (err) {
    console.log(err);
  }
};

const addEvent = async (req, res) => {
  try {
    const {
      authorID = "",
      authorImg = "",
      date,
      image,
      location,
      price,
      title,
    } = req.body;

    console.log(req.body.body);

    const data = await db.events.doc().set({
      authorID: authorID,
      authorImg: authorImg,
      date: date,
      image: image,
      location: location,
      price: price,
      title: title,
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
  getEventDetail,
  addEvent,
};
