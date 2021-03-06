'use strict';

const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      log = require('debug')('jeremypridemore-me:api:login');

log('Defining login routes.');
router.get('/',
  (req, res) => {
    res.json({
      status: 'sucess',
      user: req.user && req.user.userName
    });
});

router.post('/', passport.authenticate('local'), (req, res) => {
  res.json({
    status: 'success',
    message: `Logged in as ${req.user.userName}!`
  });
});

module.exports = router;
