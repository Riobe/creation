'use strict';

const express = require('express'),
      router = express.Router(),
      controller = require('./characters.controller'),
      log = require('debug')('creation:api:characters:routes');

log('Defining characters routes.');

router.get('/:id', controller.getCharacterById);

module.exports = router;
