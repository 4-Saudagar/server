const nodeMailer = require("../config/mail");

const sendEmail = (
  destination,
  subject,
  html,
  attachments = [],
  cb = () => {}
) => {
  const options = {
    from: process.env.MAIL_ACCOUNT,
    to: destination,
    subject,
    html,
    attachments,
  };
  nodeMailer.sendMail(options, (err, info) => {
    if (err) console.log(err);
  });
};

module.exports = { sendEmail };
