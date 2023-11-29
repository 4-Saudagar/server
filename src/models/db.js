const admin = require("../config/firebase-config");
const database = admin.firestore();
const usersCollection = database.collection("users");
const eventsCollection = database.collection("events");
const adsCollection = database.collection("ads");
const ticketsCollection = database.collection("tickets");

module.exports = {
  users: usersCollection,
  events: eventsCollection,
  ads: adsCollection,
  tickets: ticketsCollection,
};
