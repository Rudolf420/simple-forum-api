process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = require('./database.js');
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session")
const sequelize = require('./dbConfig.js');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const initializePassport = require("./passportConfig");
const expressValidator = require('express-validator');
const validator = require('./validator.js');
const { category } = require('./database.js');
const PORT = process.env.PORT || 3001;

const sessionStore = new SequelizeStore({
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

app.use(expressValidator());
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())

const isAuth = (req) => {
  if(req.session.userId) {
    console.log(req.session)
    return true;
  }
  else {
    console.log(req.session)
    return false;
  }
};

app.get("/api", async (req, res) => {
  if(isAuth(req)){
    res.status(200).send('Logged');
  }
  else{
    res.status(400).send('Not logged');
  }
});

app.post("/users/register", async (req, res) => {
  
  let { username, e_mail, password} = req.body;
  
  let err = validator.validateUserInput(req);

  if (err.length > 0){
    res.status(400).json({ errors : err });
  
  } 
  else {    
    let User = database.user;

    err = await validator.validateUser(User, req);

    if (err.length > 0){
      res.status(400).json({ errors : err });
    
    } else {
      let hashedPw = await bcrypt.hash(password, 10);

      await User.create({ 
        username: username, 
        e_mail: e_mail, 
        password: hashedPw, 
        registration_date: new Date()  
    });

    res.status(200).send('User registered');
  }
}

  
});

app.post('/users/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if ( user ) { 
      req.session.userId = user.id; 
      return res.status(200).json(user.id); 
    }
    if ( !user ) { 
      return res.status(400).send(info);
     }
  })(req, res, next);
});

app.get('/users/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/api');
});

app.post('/posts/create', async (req, res) => {
  let err = validator.validatePost(req);
  
  if (err.length > 0){
    res.status(400).json({ errors : err });
  } 
  else {
    let Post = database.post;
    let { title, text, userID, categoryID } = req.body;  
    await Post.create({ 
      title: title, 
      text: text, 
      userID: userID,
      categoryID: categoryID,
      createdAt: new Date(), 
      updatedAt: new Date() 
    
    });

    res.status(200).send('Everything ok');
  }
});

app.get('/categories/get', (req,res) => {
  let Category = database.category;

  Category.findAll(
  ).then(function(Category){
    console.log(Category);
    res.send({error:false,message:'users list',data:Category});
  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });
  
});

app.post('/posts/comments/create', async(req, res) => {
  let err = validator.validateComment(req);
  
  if (err.length > 0){
    res.status(400).json({ errors : err });
  } 
  else{
    let Comment = database.comment;
    let { text, postid, userid } = req.body;  
    await Comment.create({ 
      text: text, 
      userid: userid,
      postid: postid,
      createdAt: new Date(), 
    });

    res.status(200).send('Everything ok');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});