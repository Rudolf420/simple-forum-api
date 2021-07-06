const LocalStrategy = require("passport-local").Strategy;
const database = require('./database.js');
const bcrypt = require("bcrypt")

function initialize(passport) {

    const autenticateUser = ( e_mail, password, done ) => {

        let User = database.user;

        User.findOne({ where: {username: username} }).then(user => {
            if ( user ) {
              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if(err) {
                      throw err;
                  }

                  if(isMatch) {
                      return done(null, user);
                  }
                  else {
                      return done(null,false, {message: "Password is not correct"});
                  }
              } )
            }
            else {
                return done(null, false, {message: "Email is not registered"});
            }
          });
        
    };

    passport.use(
        new LocalStrategy(
            {

            usernameField: "e_mail",
            passwordField: "password"

    },
    autenticateUser
    )
    );

    passport.serializeuser((user, done) => done(null, user.id));
    passport.deserializeuser((id, done) => {
        let User = database.user;

        
    })
}