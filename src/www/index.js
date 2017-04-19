'use strict';

const express = require('express'),
      router = express.Router(),
      log = require('debug')('creation:www:index');

/* GET home page. */
router.all(function(req, res) {
  log('Rending index.');
  res.render('index');
});

module.exports = router;
