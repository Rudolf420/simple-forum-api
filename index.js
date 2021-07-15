process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = require('./database.js');
const express = require("express");
const bcrypt = require("bcrypt");
const { user } = require('./database.js');
const passport = require("passport");
const session = require("express-session")
const sequelize = require('./dbConfig.js');
var SequelizeStore = require("connect-session-sequelize")(session.Store);
const initializePassport = require("./passportConfig");

const PORT = process.env.PORT || 3001;

var sessionStore = new SequelizeStore({
  db: sequelize,
});

initializePassport(passport)

const app = express();

app.use(express.urlencoded({
    extended: true
  })
);

app.use(session(
  { 
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*60
    },
    store: sessionStore
  }
))

sessionStore.sync()

app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())

const isAuth = (req, res) => {
  if(req.session.userId) {
    console.log(req.session)
    return true;
  }
  else {
    console.log(req.session)
    return false;
  }
}

app.get("/api", async (req, res) => {
  if(isAuth(req, res)){
    res.status(200).send('Logged');
  }
  else{
    res.status(400).send('Not logged');
  }
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
    if (user) { 
      req.session.userId = user.id; 
      return res.status(200).json(user.id); 
    }
    if (!user) { 
      return res.status(400).send(info);
     }
  })(req, res, next);
});

app.get('/users/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/api');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});