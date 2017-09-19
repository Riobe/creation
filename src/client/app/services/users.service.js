'use strict';

const debug = require('debug')('jeremypridemore-me:services:users');
const axios = require('axios');

function register(user) {
  debug(`Registering user: ${user.userName} (${user.email})`);
  return axios.post('/api/users', {
    userName: user.userName,
    password: user.password,
    email: user.email
  });
}

debug('Exporting users service.');
module.exports = {
  current: undefined,
  register
};
