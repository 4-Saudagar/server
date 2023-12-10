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

const addPartners = async (req, res) => {
  const { orgName, contact, image, orgDesc } = req.body;
  try {
    const data = await db.ads.doc().set({
      orgName: orgName,
      image: image,
      link: link,
      contact: contact,
      orgDesc: orgDesc,
    });

    res.status(200).send({
      message: "SUCESS ADD ADS",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllPartners,
  addPartners,
};
