// Express
const express = require('express');
const session = require('express-session');

const router = express.Router();

// Passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../../modules/User');

const options = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use(new LocalStrategy(
  options,
  (async (username, password, cb) => {
    try {
      const user = await User.findByEmail(username);
      if (!user) return cb(null, false, 'Неверный логин');

      user.verifyPassword(password, (err, userVerified, info) => cb(err, userVerified, info));
    } catch (e) {
      return cb(e);
    }
  }),
));

passport.serializeUser((user, cb) => cb(null, user.id));

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    return cb(null, user);
  } catch (e) {
    return cb(e);
  }
});

// Middleware
router.use(express.urlencoded());
router.use(session({ secret: 'SECRET' }));
router.use(passport.initialize());
router.use(passport.session());

// Routing
const signupRoute = require('./signup');
const signinRoute = require('./signin');
const advertisementsRoute = require('./advertisements');

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
router.use('/advertisements', advertisementsRoute);

module.exports = router;
