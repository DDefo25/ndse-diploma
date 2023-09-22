const express = require('express');
const passport = require('passport')

const router = express.Router()
router.get('/', (req, res, next) => {
    console.log(req)
    res.json('hello')
}).post('/', 
  passport.authenticate('local', { 
    failureRedirect: '/api/signin', 
    failureMessage: true }),
  (req, res, next) => {
    res.json('ok')
})

module.exports = router;