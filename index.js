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

async function findItem(id, database) {
 const item =  await database.findOne({
    where: {
      id: id
    }
  });

  if(item) {
    return item
  }
  else
    return null
}

async function isPostCreator(req, res, next){
  let Post = database.post;
  const item = await Post.findOne({
    where: {
      id: req.params.id
    }
  })
  if(item && item.userid == req.session.userid) {
    console.log("Right user");
    next()
  }
  else {
    console.log("Wrong user");
    res.status(401).json({message: "Wrong user"});
  }
};

async function isCommentCreator(req, res, next){
  let Comment = database.comment;
  const item = await Comment.findOne({
    where: {
      id: req.params.id
    }
  })
  if(item && item.userid == req.session.userid) {
    console.log("Right user");
    next()
  }
  else {
    console.log("Wrong user");
    res.status(401).json({message: "Wrong user"});
  }
};

async function isReplyCreator(req, res, next){
  let Reply = database.reply;
  const item = await Reply.findOne({
    where: {
      id: req.params.id
    }
  })
  if(item && item.userid == req.session.userid) {
    console.log("Right user");
    next()
  }
  else {
    console.log("Wrong user");
    res.status(401).json({message: "Wrong user"});
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
    let { title, text, categoryid } = req.body;  
    await Post.create({ 
      title: title, 
      text: text, 
      userid: req.session.userid,
      categoryid: categoryid,
      createdAt: new Date(), 
      updatedAt: new Date() 
    });

    res.status(201).json({ message: "Post created" });
  }
});

app.delete('/posts/:id', isAuth, isPostCreator, async (req, res, next) => {
  let Post = database.post;
    Post.destroy({
      where: {
          id: req.params.id
      }
    }).then(function(item){
      if(item > 0){
        res.json({
          "Message" : "Post deleted",
          "Item" : item
        });
    } else{
      res.json({
        "Message" : "Post doesnt exist!",
        "Item" : item
      });
    }
    }).catch(function (err) {
      console.log(err);
      res.json({
        "Message" : "Post not deleted!",
        "Err" : err
      })
    });
});

app.get('/categories', (req,res) => {
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

    res.status(201).json({ message: "Comment created" });

  }
});

app.get('/posts/:categoryId', async(req, res, next) => {
  let Post = database.post;

  Post.findAll({
                offset: req.query.page * 10,
                limit: 10, 
                where: {
                  categoryID: req.params.categoryId 
                }
  }).then(function(posts){

    if( posts.length > 0 ){
      res.json({
        posts: posts
      }).status(200);
    }
    else {
      res.json({"message": "no posts found"}).status(404);
    }
  }).catch(function(error){
    console.log(error);
  });

});

app.delete('/posts/comments/:id',isAuth, isCommentCreator, (req, res, next) => {
  
    let Comment = database.comment;
    Comment.destroy({
      where: {
          id: req.params.id
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
);

app.post('/posts/comments/replies/:commentId', isAuth, async(req, res, next) => {
  let err = validator.validateReply(req);

  if (err.length > 0){
    res.status(400).json({ errors : err });
  } 
  else if(findItem(database.comment) == null){
    res.status(404).json({errors: "Not found comment."})
  }
  else{
    let Reply = database.reply;
    let { text } = req.body;  
    await Reply.create({ 
      text: text, 
      userid: req.session.userid,
      commentid: req.params.commentId,
      createdAt: new Date(), 
    });

    res.status(201).json({ message: "Comment created" });
  }
});

app.delete('/posts/comments/replies/:id',isAuth, isReplyCreator, (req, res, next) => {
  
  let Reply = database.reply;
  Reply.destroy({
    where: {
        id: req.params.id
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
);

app.use(function(req, res, next) {
  res.status(404).json({message: "Wrong url path or request type"});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});