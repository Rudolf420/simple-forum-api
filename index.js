process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = require('./database.js');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", async (req, res) => {
  User = database.user
  await User.create({ username: "tester", e_mail: "test@test.com", password: "test", registration_date: new Date().toLocaleString(), createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() });
  res.status(200).send('Everything ok');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

