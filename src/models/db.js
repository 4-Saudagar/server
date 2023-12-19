const admin = require("../config/firebase-config");
const database = admin.firestore();
const usersCollection = database.collection("users");
const eventsCollection = database.collection("events");
const adsCollection = database.collection("ads");
const ticketsCollection = database.collection("tickets");
const partnersCollection = database.collection("partners");
const transactionsCollection = database.collection("transactions");
const user_ticketCollection = database.collection("user_ticket");

module.exports = {
  users: usersCollection,
  events: eventsCollection,
  ads: adsCollection,
  tickets: ticketsCollection,
  partners: partnersCollection,
  transaction: transactionsCollection,
};
