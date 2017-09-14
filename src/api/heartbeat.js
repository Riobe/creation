'use strict';

const express = require('express'),
      router = express.Router(),
      packageJson = require('../../package.json'),
      log = require('debug')('creation:api:heartbeat');

log('Defining heartbeat routes.');
router.get('/',  (req, res) => {
  req.log('Getting heartbeat.');

  res.json({
    status: 'success',
    version: packageJson.version,
    time: new Date()
  });
  res.end();
});

module.exports = router;
