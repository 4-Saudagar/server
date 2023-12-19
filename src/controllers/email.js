const db = require("../models/db");
const ValidationException = require("../exceptions/ValidationException");
const { sendEmail } = require("../helpers/mailer");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const ejs = require("ejs");
var pdf = require("html-pdf");

const sendmail = async (req, res) => {
  const { email, nama, whatsapp } = req.body;
  console.log(email);

  const order_id = 1;
  const transaction = {
    event_name: "Koong Hiap",

    ticket_name: "hapi hapi hapi",
    jumlah_ticket: 3,
  };

  const fullTicketHtmlDir = path.join(
    process.cwd(),
    "/src/views/pdf/ticket.ejs"
  );
  const fullTicketHtml = await fs.promises.readFile(fullTicketHtmlDir, "utf-8");

  const attachments = [];
  const length = transaction.jumlah_ticket;
  let pdfVariables = {
    pages: [],
    total: length,
    event_name: transaction.event_name,
    item_id: transaction.ticket_name,
    start: "12-12-2023",
    end: "15-12-2023",
    date: "12-12-2023",
    location: "UMN",
  };
  let tokens = [];

  for (let i = 0; i < length; i++) {
    const token = uuid();
    tokens.push(token);
    const pageVariables = {
      nama,
      email,
      qr: token,
      ticket_token: token,
      ticket_number: i + 1,
      item_id: transaction.ticket_name,
    };

    pdfVariables.pages.push(pageVariables);
  }

  const pdfHtmlDoc = ejs.render(fullTicketHtml, pdfVariables);
  const filename = `Ticket - ` + transaction.event_name.toString() + `.pdf`;
  const pathName = `storage/${filename}`;

  attachments.push({ filename, path: pathName });

  await pdf
    .create(pdfHtmlDoc, {
      width: "1200px",
      height: "1650px",
    })
    .toStream(function (err, stream) {
      stream.pipe(fs.createWriteStream(pathName));
    });

  const variables = {
    event: {
      title: "NAMA EVENT",
      start: "16.00",
      end: "18.00",
      date: "24 November 2023",
      loc: "TEMPAT EVENT",
    },
    nama: nama,
    transaction_id: "TRANSC",
    jumlah_ticket: 3,
    wa: whatsapp,
    email: email,
  };

  const emailHtmlDir = path.join(process.cwd(), "/src/views/mail/ticket.ejs");

  const html = await fs.promises.readFile(emailHtmlDir, "utf-8");
  const renderHtml = ejs.render(html, variables);

  sendEmail(
    email,
    "[ Tiket " + transaction.event_name + " ]",
    renderHtml,
    attachments,
    (err, data) => {
      if (err) {
        console.log("Error sending email : ", err.message);
      }

      for (let file of attachments) {
        fs.unlink(file?.path, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err}`);
          }
        });
      }
    }
  );

  res.status(200).send({ message: "Success!" });
};

module.exports = { sendmail };
