'use strict';

const express = require('express'),
      router = express.Router(),
      userData = require('./userData'),
      log = require('debug')('creation:api:logout');

/* GET users listing. */
router.post('/', function(req, res) {
  log('Logging out.');
  delete userData.riobe.loggedIn;

  res.sendStatus(200);
});

module.exports = router;
