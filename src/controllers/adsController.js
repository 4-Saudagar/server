const db = require("../models/db");

const getAllAds = async (req, res) => {
  try {
    const data = await db.ads.get();
    let ads = [];
    data.forEach((snapshot) => {
      ads.push(snapshot.data());
    });
    return res.status(200).send({
      status: 200,
      data: ads,
    });
  } catch (err) {
    console.log(err);
  }
};

const addAds = async (req, res) => {
  const { image, link, name } = req.body;
  try {
    const data = await db.ads.doc().set({
      image: image,
      link: link,
      name: name,
    });

    res.status(200).send({
      message: "SUCESS ADD ADS",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllAds,
  addAds,
};
