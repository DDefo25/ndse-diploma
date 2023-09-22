const express = require('express');
const crypto = require('node:crypto');
const User = require('../../modules/User')

const router = express.Router()

router.get('/', (req, res, next) => {
    console.log(req)
    res.json('hello')
}).post('/', async (req, res, next) => {
    const {email, password, name, contactPhone=''} = req.body;
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, derivedKey) => {
      if (err) { return next(err); }
      try {
        const user = await User.create({
            email,
            passwordHash: derivedKey.toString('hex'),
            name,
            contactPhone
        })
        res.json({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                contactPhone: user.contactPhone
            },
            status: "ok"
        })
      } catch (e) {
        res.status(500).json({
            error: e.message,
            status: "error"
        })
      }

    });
})

module.exports = router;