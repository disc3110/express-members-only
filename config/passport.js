const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" }, // form field name
      async (username, password, done) => {
        try {
          const user = await User.findByUsername(username);
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }

          const match = await bcrypt.compare(password, user.password_hash);
          if (!match) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = configurePassport;