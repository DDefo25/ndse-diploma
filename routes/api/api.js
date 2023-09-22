const express = require('express');

const signupRoute = require('./signup');
// const signinRoute = require('./signin');
// const advertisementsRoute = require('./advertisements');

const router = express.Router();

router.use('/signup', signupRoute);
// router.use('/signin', signinRoute);
// router.use('/advertisements', advertisementsRoute);

module.exports = router;