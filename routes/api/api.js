const express = require('express');

const signupRoute = require('./signup');
const signinRoute = require('./signin');
// const advertisementsRoute = require('./advertisements');

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../../modules/User')

const options = {
  usernameField: "email",
  passwordField: "password",
}

passport.use(new LocalStrategy(
  options,
  async function verify(username, password, cb) {
    try {
      const user = await User.findByEmail(username);
      if (!user) return cb(null, false, { message: 'Неверный логин или пароль' })
      
      user.verifyPassword(password, (err, user) => {
        return cb(err, user)
      })
    } catch (e) {
      return cb(e);
    }
}));

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser(async (email, cb) => {
  try {
    const user = await User.findByEmail(email)
    cb(null, user)
  } catch (e) {
    cb(e)
  }
})

const router = express.Router()
router.use(express.urlencoded());
router.use(session({ secret: 'SECRET'}));
router.use(passport.initialize())
router.use(passport.session())

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
// router.use('/advertisements', advertisementsRoute);

module.exports = router;