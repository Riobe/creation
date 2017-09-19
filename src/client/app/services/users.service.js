'use strict';

const debug = require('debug')('jeremypridemore-me:services:users');
const axios = require('axios');

function register(userName, password, email) {
  debug(`Registering user: ${userName} (${email})`);
  return axios.post('/api/users', {
    userName,
    password,
    email
  });
}

debug('Exporting users service.');
module.exports = {
  register
};
