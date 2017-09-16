'use strict';

const mongoose = require('mongoose'),
      log = require('debug')('jeremypridemore-me:setup:mongoose');

log('Setting up mongoose.');

const connectionUri = process.env.DATABASE_URI || 'mongodb://localhost/test';
log(`Connecting to MongoDB at ${connectionUri}.`);

mongoose.connect(connectionUri, {
  // http://mongoosejs.com/docs/connections.html#use-mongo-client
  useMongoClient: true
});

log('Registering models with mongoose.');
require('../models');

module.exports = mongoose.connection;
