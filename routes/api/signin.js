const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json('hello');
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.json({
        error: info.message,
        status: 'error',
      });
    }
    req.logIn(user, (e) => {
      if (e) { return next(e); }
      return res.json({
        data: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          contactPhone: req.user.contactPhone,
        },
        status: 'ok',
      });
    });
  })(req, res, next);
});

module.exports = router;
