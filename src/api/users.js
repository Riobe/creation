'use strict';

const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      requireLogin = require('../utility/require-login'),
      log = require('debug')('jeremypridemore-me:api:users');

log('Defining user routes.');

router.post('/', (req, res) => {
  req.log('Saving new user.');
  const newUser = new User(req.body);

  const sendValidationErrorOf = error => {
    res.status(422).json({
      status: 'error',
      message: error
    });
  };

  let error = newUser.validateUserName();
  if (error) {
    req.log(`Cannot create user due to bad user name of ${newUser.userName}.`);
    return sendValidationErrorOf(error);
  }

  error = newUser.validateEmail();
  if (error) {
    req.log(`Cannot create user due to bad email of ${newUser.email}.`);
    return sendValidationErrorOf(error);
  }

  error = newUser.validatePassword();
  if (error) {
    req.log('Cannot create user due to bad password.');
    return sendValidationErrorOf(error);
  }

  User.hashPassword(newUser);

  newUser.save()
    .then(user => {
      req.log(`Made new user: ${user.userName}`);
      res.json({
        status: 'success',
        message: 'User successfully created!'
      });
    })
    .catch(error => {
      if (error.errmsg.startsWith('E11000 duplicate key error collection:')) {
        req.log('Cannot create user due to duplicate user.');
        return res.status(409).json({
          status: 'error',
          message: 'That user already exists.'
        });
      }

      log(`ERROR: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'User could not be saved.'
      });
    });
});

router.get('/:userName',
  requireLogin,
  (req, res) => {
    res.json({
      status: 'success',
      user: {
        userName: 'riobe'
      }
    });
});

module.exports = router;
