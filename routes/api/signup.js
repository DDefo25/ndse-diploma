const express = require('express');
const User = require('../../modules/User');

const router = express.Router();

router.get('/', (req, res) => {
  res.json('hello');
});

router.post('/', async (req, res, next) => {
  const {
    email, password, name, contactPhone = '',
  } = req.body;
  await User.hashPassword(password, async (err, hash) => {
    try {
      if (err) next(err);
      const user = await User.create({
        email,
        passwordHash: hash,
        name,
        contactPhone,
      });
      res.json({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
        },
        status: 'ok',
      });
    } catch (e) {
      res.status(500).json({
        error: e.message,
        status: 'error',
      });
    }
  });
});

module.exports = router;
