'use strict';

const characterData = require('./mock-character-data'),
      log = require('debug')('creation:api:characters:routes');

log('Exporting character controller functions.');
exports.getCharacterById = function(req, res, next) {
  let id = req.params.id,
      character = characterData[id];

  if (!character) {
    let error = new Error(`Could not find a character with id: ${id}`);
    error.status = 404;
    return next(error);
  }

  res.json(character);
};
