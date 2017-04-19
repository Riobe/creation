'use strict';

const express = require('express'),
      router = express.Router(),
      userData = require('./userData'),
      inspect = require('util').inspect,
      log = require('debug')('creation:api:login');

/* GET users listing. */
router.post('/', function(req, res) {
  let userName = req.body.userName,
      password = req.body.password;

  log(inspect({
    path: req.path,
    verb: 'POST',
    userName: userName
  }));

  // The pinnacle of security right here.
  if (userName === 'riobe' && password === 'q') {
    log('Returning hardcoded user.');
    // TODO: Put passport in here to handle auth. Demo or no, it'd be useful to learn.
    userData.riobe.loggedIn = true;
    return res.json(userData.riobe);
  }

  res.sendStatus(401);
});

module.exports = router;

