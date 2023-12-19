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
    const {
      tickets_id = "2q22hC1nfPIjqtHysKVF",
      jumlah = 2,
      id,
      nama,
      email,
      whatsapp,
    } = req.body;

    {
      event_name;
      ticket_name;
      ticket_id;
      jumlah_ticket;
      nama;
      email;
      wa;
      order_id;
    }

    const userData = {
      id: uuid(),
      nama: nama,
      email: email,
      whatsapp: whatsapp,
    };
    console.log("gagal");

    const transaction_id = uuid();

    const data = await db.tickets.doc(tickets_id).get();

    const ticket = data.data();

    console.log(ticket, data);

    const body = {
      transaction_details: {
        order_id: transaction_id,
        gross_amount: Number(ticket.price) * Number(jumlah),
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: tickets_id,
          price: ticket.price,
          name: ticket.name,
          quantity: jumlah,
        },
      ],
      customer_details: userData,
    };

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
