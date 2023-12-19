const db = require("../models/db");

const getAllPartners = async (req, res) => {
  try {
    const data = await db.partners.get();

    let partners = [];
    data.forEach((snapshot) => {
      partners.push({ id: snapshot.id, ...snapshot.data() });
    });

    return res.status(200).send({
      status: 200,
      data: partners,
    });
  } catch (err) {
    console.log(err);
  }
};

const allowPartner = async (req, res) => {
  try {
    const userID = req.body;

    await db.partners.doc().set({
      partnerID: userID,
    });

    await db.users.doc(userID).update({
      type: "2",
    });

    res.status(200).send({
      message: "PARTNER  ALLOWED",
    });
  } catch (err) {
    res.status(500).send({
      message: "PARTNER NOT ALLOWED",
    });
  }
};

const addPartners = async (req, res) => {
  const { orgName, contact, image, orgDesc } = req.body;
  try {
    const data = await db.ads.doc().set({
      orgName: orgName,
      orgName: orgName,
      contact: contact,
      image: image,
      orgDesc: orgDesc,
    });

    res.status(200).send({
      message: "SUCESS ADD ADS",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllPartners,
  addPartners,
  allowPartner,
};
