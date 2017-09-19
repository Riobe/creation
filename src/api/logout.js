'use strict';

const express = require('express'),
      router = express.Router(),
      log = require('debug')('jeremypridemore-me:api:logout');

log('Defining logout routes.');
router.post('/', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  res.json({
    status: 'success',
    message: 'Logged out. Session destroyed if present.'
  });
});

module.exports = router;
