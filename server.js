require("dotenv/config");
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT;
const APP_URL = process.env.APP_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello");
});
app.set("view engine", "ejs");
app.get("/testmail", (req, res) => {
  res.render("mail/ticket", {
    event: {
      title: "NAMA EVENT",
      start: "16.00",
      end: "18.00",
      date: "24 November 2023",
      loc: "TEMPAT EVENT",
    },
    nama: "test",
    transaction_id: "TRANSC",
    jumlah_ticket: 2,
    wa: "0842148712",
    email: "EMAIL",
  });
});
app.get("/testpdf", (req, res) => {
  res.render("pdf/ticket", {
    item_id: "itemid",
    header: "LINK IMAGE HEADER",
    event_name: "EVENT NAME",
    start: "16.00",
    end: "18.00",
    date: "32 DESEMBER 2023",
    location: "LOCATION",
    pages: [
      {
        ticket_number: 1,
        ticket_token: "token1",
        nama: "nama1",
        email: "email1",
        qr: "linkqr1",
      },
      {
        ticket_number: 2,
        ticket_token: "token2",
        nama: "nama2",
        email: "email2",
        qr: "linkqr2",
      },
      {
        ticket_number: 3,
        ticket_token: "token3",
        nama: "nama3",
        email: "email3",
        qr: "linkqr3",
      },
    ],
  });
});

app.use("/user", require("./src/routes/user"));
app.use("/events", require("./src/routes/event"));
app.use("/ads", require("./src/routes/ads"));
app.use("/home", require("./src/routes/home"));
app.use("/transaction", require("./src/routes/transaction"));
app.use("/partner", require("./src/routes/partner"));

app.listen(PORT, () => {
  console.log(`Listening to the server on port : ${PORT}`);
});
