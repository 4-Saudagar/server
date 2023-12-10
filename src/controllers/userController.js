const db = require("../models/db");
const admin = require("../config/firebase-config");
const ValidationException = require("../exceptions/ValidationException");

const checkLogin = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    if (token == undefined) {
      throw new ValidationException(404, "Token required", "TOKEN NOT FOUND");
    }

    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      req.user = decodeValue;
      const id = decodeValue.uid;
      console.log("id", decodeValue);
      let users = await db.users.doc(id).get();

      console.log("users", users.data());

      return res.status(200).json({
        code: 200,
        data: users.data(),
      });
    } else {
      throw new ValidationException(404, "user not found", "USER NOT FOUND");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationException) {
      return res.status(err.code).send({
        code: err.code,
        type: err.type,
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error : " + err.message,
    });
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
          type: 3,
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
    console.log("token: " + token);
    if (!token) {
      throw new ValidationException(404, "Token required", "TOKEN NOT FOUND");
    }
    const decodeValue = await admin.auth().verifyIdToken(token);
    const id = decodeValue.user_id;

    console.log("user", decodeValue);

    await db.users.doc(id).set({
      name: "",
      image: "",
      email: decodeValue.email,
      type: 3,
    });

    return res.status(200).send({
      message: "Success registering user",
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationException) {
      return res.status(err.code).send({
        code: err.code,
        type: err.type,
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error : " + err.message,
    });
  }
};

module.exports = {
  checkLogin,
  googleUser,
  userRegis,
};
