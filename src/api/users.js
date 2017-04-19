'use strict';

const express = require('express'),
      router = express.Router(),
      inspect = require('util').inspect,
      userData = require('./userData'),
      log = require('debug')('creation:api:users');

router.put('/:id', (req, res) => {
  log(`Updating user: ${req.params.id}`);
  log(`User keys: ${Object.keys(userData)}`);
  log(`Mapped to an array: ${inspect(Object.keys(userData).map(name => userData[name]))}`);
  log(`Updating user: ${req.params.id}`);
  let user = Object.keys(userData).map(name => userData[name]).find(user => user.id === +req.params.id);
  userData[user.userName] = req.body;
  res.json(req.body);
});

module.exports = router;
