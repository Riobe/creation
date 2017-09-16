'use strict';

const mongoose = require('mongoose'),
      bluebird = require('bluebird'),
      log = require('debug')('jeremypridemore-me:setup:mongoose');

log('Setting up mongoose.');

// http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library
mongoose.Promise = bluebird;

const connectionUri = process.env.DATABASE_URI || 'mongodb://localhost/test';
log(`Connecting to MongoDB at ${connectionUri}.`);

mongoose.connect(connectionUri, {
  // http://mongoosejs.com/docs/connections.html#use-mongo-client
  useMongoClient: true,
  // http://mongoosejs.com/docs/promises.html#promises-for-the-mongodb-driver
  promiseLibrary: bluebird
});

log('Registering models with mongoose.');
require('../models');

module.exports = mongoose.connection;
