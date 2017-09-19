'use strict';

const debug = require('debug')('jeremypridemore-me:services:login');
const axios = require('axios');

function login(userName, password) {
  if (typeof userName === 'object') {
    password = userName.password;
    userName = userName.userName;
  }

  debug(`Trying to login as: ${userName}`);
  return axios.post('/api/login', {
    userName,
    password,
  });
}

debug('Exporting login service.');
module.exports = {
  login
};
