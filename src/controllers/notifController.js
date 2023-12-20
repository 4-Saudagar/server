const db = require("../models/db");
const ValidationException = require("../exceptions/ValidationException");
const { sendEmail } = require("../helpers/mailer");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const ejs = require("ejs");
var pdf = require("html-pdf");

const notif = async (req, res) => {
  try {
    const payload = req.body;
    const { transaction_status, order_id } = payload;

    if (!order_id.startsWith("UTIXT-")) {
      throw new ValidationException(404, "bukan transaksi utixt", "DONT KNOW");
    }

    await db.transaction.doc(order_id).update({
      status: transaction_status,
    });

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      const docRef = await db.transaction.doc(order_id).get();
      const transaction = docRef.data();

      const fullTicketHtmlDir = path.join(
        process.cwd(),
        "/src/views/pdf/ticket.ejs"
      );
      const fullTicketHtml = await fs.promises.readFile(
        fullTicketHtmlDir,
        "utf-8"
      );

      const attachments = [];
      let index = 0;
      const length = transaction.jumlah_ticket;
      let pdfVariables = {
        pages: [],
        total: length,
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
          ticket_number: 1 + 1,
          item_id: transaction.ticket_name,
        };

        pdfVariables.pages.push(pageVariables);
      }

      const pdfHtmlDoc = ejs.render(fullTicketHtml, pdfVariables);
      const filename = `Ticket - ` + transaction.event_name + `.pdf`;
      const pathName = `storage/${filename}`;

      attachments.push({ filename, path: pathName });

      pdf
        .create(pdfHtmlDoc, {
          width: "1200px",
          height: "1650px",
        })
        .toStream(function (err, stream) {
          stream.pipe(fs.createWriteStream(pathName));
        });

      // email
      const { nama, email } = transaction;
      const variables = {
        nama,
        email,
        jumlah_ticket: length,
        transaction_id: order_id,
      };

      const emailHtmlDir = path.join(
        process.cwd(),
        "/src/views/mail/ticket.ejs"
      );

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

      for (token of tokens) {
        await db.user_ticket.doc(token).set({
          arrival: false,
          ticket_id: transaction.ticket_id,
          nama: nama,
          email: email,
        });
      }
    } else if (transaction_status != "pending") {
      await db.transaction.doc(order_id).delete();
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  console.log(payload);
};

module.exports = { notif };
