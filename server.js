require("dotenv/config");
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT;
const APP_URL = process.env.APP_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.static("storage"));
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/user", require("./src/routes/user"));
app.use("/events", require("./src/routes/event"));
app.use("/ads", require("./src/routes/ads"));
app.use("/home", require("./src/routes/home"));
app.use("/transaction", require("./src/routes/transaction"));
app.listen(PORT, () => {
  console.log(`Listening to the server on port : ${PORT}`);
});
