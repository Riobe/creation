'use strict';

const debug = require('debug')('jeremypridemore-me:app');
const axios = require('axios');

function login(userName, password) {
  debug('Making login call.');
  return axios.post('/api/login', {
    userName: userName,
    password: password
  });
}

debug('Exporting login service.');
export default {
  login
};
