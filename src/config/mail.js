const nodemailer = require("nodemailer");

const service = process.env.MAIL_SERVICE;
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const user = process.env.MAIL_ACCOUNT;
const pass = process.env.MAIL_PASSWORD;
const clientID = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const accessToken = process.env.GMAIL_OAUTH_ACCESS_TOKEN;
const refreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN;

if (!global.transporter) {
  try {
    global.transporter = nodemailer.createTransport({
      host,
      service: 'gmail', 
      auth: {
        type: 'OAuth2',
        user: user, 
        pass : pass,
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      }
    });
  } catch (error) {
    console.error("Error creating nodemailer transporter:", error);
  }
}

module.exports = global.transporter;
