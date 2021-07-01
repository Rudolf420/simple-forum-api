process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = require('./database.js');
const express = require("express");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({
    extended: true
  })
);

app.use(express.json())

app.get("/api", async (req, res) => {
  User = database.user
  await User.create({ username: "tester1", e_mail: "test1@test.com", password: "test", registration_date: new Date().toLocaleString(), createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() });
  res.status(200).send('Everything ok');
});

app.post("/users/register", async (req, res) => {
  
  let { username, e_mail, password, password2} = req.body;
  let err = []; 
  
  if (!username, !e_mail, !password, !password2) {
    err.push({message: "Please enter all fields"});
  }

  if (password != password2) {
    err.push({message: "Passwords do not match"});
  }

  if (err.length > 0){
    res.status(400).json({ errors : err });
  } else {
    let hashedPw = await bcrypt.hash(password, 10);
  }


});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

