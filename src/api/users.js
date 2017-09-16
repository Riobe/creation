'use strict';

const express = require('express'),
      router = express.Router(),
      packageJson = require('../../package.json'),
      log = require('debug')('jeremypridemore-me:api:heartbeat');

log('Defining user routes.');
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
