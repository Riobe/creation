'use strict';

const express = require('express'),
      router = express.Router(),
      userData = require('./userData'),
      log = require('debug')('creation:api:current-identity');

router.get('/',  (req, res) => {
  log(`Asking for identity. Currently ${userData.riobe.loggedIn ? '' : 'not '}logged in.'`);
  if (userData.riobe.loggedIn) {
    return res.json(userData.riobe);
  }

  res.json({});
});

module.exports = router;
