process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = require('./database.js');
const express = require("express");
const bcrypt = require("bcrypt");
const { user } = require('./database.js');
const passport = require("passport");

const initializePassport = require("./passportConfig");

const PORT = process.env.PORT || 3001;

initializePassport(passport)

const app = express();

app.use(passport.initialize())

app.use(express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.get("/api", async (req, res) => {
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
  
  } 
  else {

    let hashedPw = await bcrypt.hash(password, 10);
    let User = database.user

    User.findOne({ where: {username: username} }).then(user => {
      if ( user ) {
        err.push({ message : 'Username already taken' });
      }
    });

    User.findOne({ where: {e_mail: e_mail} }).then(user => {
      if ( user ) {
        err.push({ message : 'E-mail already used' });
      }
    });

    if (err.length > 0){
      res.status(400).json({ errors : err });
    
    } else {

    await User.create({ 
      username: username, 
      e_mail: e_mail, 
      password: hashedPw, 
      registration_date: new Date().toLocaleString(), 
      createdAt: new Date().toLocaleString(), 
      updatedAt: new Date().toLocaleString() 
    
    });
  }
}

  res.status(200).send('Everything ok');
});

app.post('/users/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (user) { return res.status(200).json(user.id); }
    if (!user) { return res.status(400).send(info); }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});