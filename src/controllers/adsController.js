const db = require("../models/db");

const getAllAds = async (req, res) => {
  try {
    const data = await db.ads.get();
    let ads = [];
    data.forEach((snapshot) => {
      ads.push({ id: snapshot.id, ...snapshot.data() });
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
  const { adsTitle, image, link, contact, dateStart, dateEnd } = req.body;
  try {
    const data = await db.ads.doc().set({
      image: image,
      link: link,
      adsTitle: adsTitle,
      contact: contact,
      dateStart: dateStart,
      dateEnd: dateEnd,
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
  getAllAds,
  addAds,
};
