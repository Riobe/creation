'use strict';

const debug = require('debug')('jeremypridemore-me:services:login');
const axios = require('axios');
const userService = require('./users.service');

function login(userName, password) {
  if (typeof userName === 'object') {
    password = userName.password;
    userName = userName.userName;
  }

  debug(`Trying to login as: ${userName}`);
  return axios.post('/api/login', {
    userName,
    password,
  }).then(res => {
    userService.current = {
      userName
    };

    return res;
  });
}

function checkLogin() {
  return axios.get('/api/login')
    .then(res => {
      if (!res.data.user) {
        return;
      }

      userService.current = {
        userName: res.data.user
      };
    });
}

function logout() {
  return axios.post('/api/logout').then(res => {
    userService.current = undefined;

    return res;
  });
}

debug('Exporting login service.');
module.exports = {
  login,
  logout,
  checkLogin
};
