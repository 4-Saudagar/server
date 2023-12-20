const db = require("../models/db");
const admin = require("../config/firebase-config");
const { midtransSnap } = require("../config/midtrans");
const { v4: uuid } = require("uuid");
const Midtrans = require("midtrans-client");
const { name } = require("ejs");

let snap = new Midtrans.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const transaction = async (req, res) => {
  try {
    const { ticket, userID, email } = req.body;

    const userData = {
      id: userID,
      nama: nama,
      email: email,
    };

    console.log("gagal");

    const transaction_id = uuid();

    const all_ticket = [];
    const primises = ticket.map(async (e) => {
      const ticket_server = await db.tickets.doc(e.ticketID).get();
      const data = ticket_server.data();
      all_ticket.push(data);
    });

    const gross_amount = 0;
    all_ticket.map((e, index) => {
      gross_amount += e.harga * ticket[index].jumlah;
    });

    console.log(ticket, data);

    const body = {
      transaction_details: {
        order_id: transaction_id,
        gross_amount: gross_amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: ticket,
      customer_details: userData,
    };

    await db.transaction.doc(transaction_id).set({
      ticket: ticket,
      userID: userID,
      email: email,
    });

    console.log("gagal 4");
    const token = await snap.createTransactionToken(body);
    console.log("gagal 5");
    return res.status(201).send({
      code: 201,
      message: "Berhasil menukar token snap.",
      data: { token },
    });
  } catch (err) {
    console.log("error", err.message);
    // res.status(500).send({ message: err.message });
  }
};

const listTransactions = async (req, res) => {
  try {
    const { eventID } = req.body;
    const snapshot = await db
      .transaction()
      .where("eventID", "==", eventID)
      .get();
    const transactions = [];

    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      messsage: "Transaction Event",
      data: transactions,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  transaction,
  listTransactions,
};
