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

    // if (!order_id.startsWith("UTIXT-")) {
    //   throw new ValidationException(404, "bukan transaksi utixt", "DONT KNOW");
    // }

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      await db.transaction.doc(order_id).update({
        status: transaction_status,
      });

      console.log("ada");
      console.log("ada2");
      const docRef = await db.transaction.doc(order_id).get();
      const trans = docRef.data();
      console.log("ada3");
      const userRef = await db.users.doc(trans.userID).get();
      const user = userRef.data();
      console.log("ada4");
      const eventRef = await db.events.doc(trans.eventID).get();
      const event = eventRef.data();
      console.log("ada5");

      let jumlah_ticket = 0;
      trans.ticket.forEach((e) => {
        jumlah_ticket += e.jumlah;
      });

      const transaction = {
        event_name: event.title,
        ticket_name: event.title,
        jumlah_ticket: jumlah_ticket,
      };

      console.log("ada");

      const fullTicketHtmlDir = path.join(
        process.cwd(),
        "/src/views/pdf/ticket.ejs"
      );
      const fullTicketHtml = await fs.promises.readFile(
        fullTicketHtmlDir,
        "utf-8"
      );

      console.log("aman");

      const attachments = [];
      const length = transaction.jumlah_ticket;
      let pdfVariables = {
        pages: [],
        total: length,
        event_name: transaction.event_name,
        item_id: transaction.ticket_name,
        start: event.dateStart,
        end: event.dateEnd,
        date: event.dateEnd,
        location: event.location,
      };
      let tokens = [];

      for (let i = 0; i < length; i++) {
        const token = uuid();
        tokens.push(token);
        const pageVariables = {
          nama: user.name,
          email: user.email,
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

      pdf
        .create(pdfHtmlDoc, {
          width: "1200px",
          height: "1650px",
        })
        .toStream(function (err, stream) {
          stream.pipe(fs.createWriteStream(pathName));
        });

      const variables = {
        event: {
          title: transaction.event_name,
          start: event.dateStart,
          end: event.dateEnd,
          date: event.dateEnd,
          loc: event.location,
        },
        nama: user.name,
        transaction_id: order_id,
        jumlah_ticket: jumlah_ticket,
        email: user.email,
      };

      const emailHtmlDir = path.join(
        process.cwd(),
        "/src/views/mail/ticket.ejs"
      );

      const html = await fs.promises.readFile(emailHtmlDir, "utf-8");
      const renderHtml = ejs.render(html, variables);

      sendEmail(
        user.email,
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

      let flag = [];
      trans.ticket.forEach((e) => {
        flag.push(e.jumlah);
      });

      let index = 0;

      for (token of tokens) {
        if ((flag[index] = 0)) {
          index++;
        }

        await db.user_ticket.doc(token).set({
          arrival: false,
          ticket_id: trans.ticket[index].ticketID,
          nama: user.name,
          email: user.email,
          eventID: trans.eventID,
        });
        flag[index]--;
      }
      res.status(200).send({ message: "Success!" });
    } else if (transaction_status != "pending") {
      await db.transaction.doc(order_id).delete();
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    console.log(err);
  }
};

module.exports = { notif };
