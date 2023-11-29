const midtransClient = require("midtrans-client");

const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

if (!global.midtransClient) {
  global.midtransClient = new midtransClient.CoreApi({
    isProduction: process.env.NODE_ENV == "production" ? true : false,
    clientKey:
      process.env.NODE_ENV == "production"
        ? CLIENT_KEY
        : process.env.CLIENT_KEY_DEV,
    serverKey:
      process.env.NODE_ENV == "production"
        ? CLIENT_KEY
        : process.env.CLIENT_KEY_DEV,
  });
}

if (!global.midtransSnap) {
  global.midtransSnap = new midtransClient.Snap({
    isProduction: process.env.NODE_ENV == "production" ? true : false,
    clientKey:
      process.env.NODE_ENV == "production"
        ? CLIENT_KEY
        : process.env.CLIENT_KEY_DEV,
    serverKey:
      process.env.NODE_ENV == "production"
        ? CLIENT_KEY
        : process.env.CLIENT_KEY_DEV,
  });
}

module.exports = {
  midtransCore: global.midtransClient,
  midtransSnap: global.midtransSnap,
};
