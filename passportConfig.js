const LocalStrategy = require("passport-local").Strategy;
const database = require('./database.js');
const bcrypt = require("bcrypt")

function initialize(passport) {

    const autenticateUser = ( e_mail, password, done ) => {

        let User = database.user;

        User.findOne({ where: {e_mail: e_mail} }).then(user => {
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

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        let User = database.user;

        User.findOne({ where: {id: id} }).then(user => {
            if ( user ) {
              return done(null, user)
            }
            else{
                console.log(`not found while serialization`);
            }
          });


    })
}

module.exports = initialize;