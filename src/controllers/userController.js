const db = require("../models/db");
const admin = require("../config/firebase-config");

const checkLogin = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      req.user = decodeValue;
      const id = decodeValue.uid;
      console.log("id", decodeValue);
      let users = await db.users.doc(id).get();
      if (users.data() !== undefined) {
        return res.status(200).json({
          code: 200,
          data: users.data(),
        });
      }
    } else {
      return res.status(500).json({
        code: 500,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const googleUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      const id = decodeValue.user_id;
      // console.log("id", decodeValue);
      const users = await db.users.doc(id).get();
      console.log(users);

      if (!users.data()) {
        await db.users.doc(id).set({
          name: decodeValue.name,
          image: decodeValue.picture,
          email: decodeValue.email,
        });
        users = await db.users.doc(id).get();
      }

      return res.status(200).json({
        message: "google authenticated",
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const userRegis = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await admin.auth().verifyIdToken(token);
    const id = decodeValue.user_id;

    await db.users.doc(id).set({
      name: decodeValue.name,
      image: decodeValue.picture,
      email: decodeValue.email,
    });

    return res.status(200).send({
      message: "Success registering user",
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  checkLogin,
  googleUser,
  userRegis,
};
