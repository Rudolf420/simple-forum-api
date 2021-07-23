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
));

sessionStore.sync();

app.use(expressValidator());
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())

function isAuth(req, res, next) {
  if(req.session.userid) {
    console.log("Is logged");
    next();
  }
  else {
    console.log("Not logged");
    res.status(401).json({message: "Not logged"});
  }
};

const isCreator = (req, params) => {
  console.log(req.session.userid)
  console.log(req.body.id)
  if(isAuth(req) && req.session.userid == params) {
    return true;
  }
  else {
    return false;
  }
};

app.get("/api", async (req, res) => {
  res.send("vsetko fici")
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
      req.session.userid = user.id; 
      return res.status(200).json({message:"Logged in", userid:user.id}); 
    }
    if ( !user ) { 
      return res.status(400).send(info);
     }
  })(req, res, next);
});

app.get('/users/logout', (req,res) => {
  if(req.session.userid){
    req.session.destroy();
    res.status(200).json({message:"User was logged out"});
  }
  else{
    res.status(404).json({message:"User not found logged"});
  }
});

app.post('/posts', isAuth, async (req, res, next) => {
  let err = validator.validatePost(req);
  
  if (err.length > 0){
    res.status(400).json({ errors : err });
  } 
  else {
    let Post = database.post;
    let { title, text, categoryID } = req.body;  
    await Post.create({ 
      title: title, 
      text: text, 
      userID: req.session.userid,
      categoryID: categoryID,
      createdAt: new Date(), 
      updatedAt: new Date() 
    });

    res.status(201).send('Post created');
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

app.post('/posts/comments', isAuth, async(req, res, next) => {
  let err = validator.validateComment(req);

  if (err.length > 0){
    res.status(400).json({ errors : err });
  } 
  else{
    let Comment = database.comment;
    let { text, postid } = req.body;  
    await Comment.create({ 
      text: text, 
      userid: req.session.userid,
      postid: postid,
      createdAt: new Date(), 
    });

    res.status(400).json({ message: "ok" });

}});

app.delete('/posts/comments/:commentId', (req, res) => {

  if(isCreator(req, req.params.commentId)){
    let Comment = database.comment;
    Comment.destroy({
      where: {
          id: req.params.commentId
      }
    }).then(function(item){
      if(item > 0){
        res.json({
          "Message" : "Comment deleted!",
          "Item" : item
        });
    } else{
      res.json({
        "Message" : "Comment doesnt exist!",
        "Item" : item
      });
    }
    }).catch(function (err) {
      console.log(err);
      res.json({
        "Message" : "Comment not deleted!",
        "Err" : err
      })
    });
  }
  else{
      res.status(400).json({
        "Message" : "Not authorized.",
      })
    }
});

app.use(function(req, res, next) {
  res.status(404).json({message: "Wrong url path or request type"});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});