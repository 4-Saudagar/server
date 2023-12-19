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

const getAuthorEvent = async (req, res) => {
  try {
    const { authorID } = req.body;
    const data = await db.events.where("authorID", "=", authorID).get();

    let events = [];

    const promises = data.docs.map(async (snapshot) => {
      const event = { ...snapshot.data() };
      const partner = await db.partners.doc(event.authorID).get();
      const ticket = await db.tickets.where("eventID", "=", snapshot.id).get();
      const tickets = [];
      ticket.forEach((ticket) => {
        tickets.push({
          ticketID: ticket.id,
          name: ticket.data().nama,
          price: ticket.data().harga,
        });
      });
      console.log(ticket);

      return {
        author: { ...partner.data() },
        id: snapshot.id,
        ...event,
        ticket: tickets,
      };
    });

    events = await Promise.all(promises);

    return res.status(200).send({
      status: 200,
      data: events,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

const editEvent = async (req, res) => {
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
      eventID,
    } = req.body;

    console.log(req.body);

    const data = await db.events.doc(eventID).update({
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
      if (!eventID) {
        await db.tickets.doc(uuid()).set({
          eventID: eventID,
          nama: e.nama,
          harga: e.harga,
        });
      } else {
        await db.tickets.doc(e.ticketID).set({
          eventID: eventID,
          nama: e.nama,
          harga: e.harga,
        });
      }
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

module.exports = {
  getAllEvent,

  addEvent,
};
