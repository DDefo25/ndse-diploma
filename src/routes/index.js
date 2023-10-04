const express = require('express');

const apiRoute = require('./api/api');

const router = express.Router();

router.use('/api', apiRoute);

router.get('/', (_, res) => {
  res.redirect('/api');
});

module.exports = router;
