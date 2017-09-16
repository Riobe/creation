'use strict';

const crypto = require('crypto'),
      pbkdf2 = require('pbkdf2'),
      mongoose = require('mongoose'),
      topPasswords = require('../utility/top-10k-passwords'),
      log = require('debug')('jeremypridemore-me:models:user');

log('Defining User model.');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  email: String
});

function hash(password, salt) {
  return pbkdf2.pbkdf2Sync(password, salt, 10, 128, 'sha512').toString('hex');
}

userSchema.statics.validatePassword = function(password) {
  const errors = [];

  const characterCount = password
    .split('')
    .filter((character, i, array) => array.indexOf(character) === i)
    .length;

  if (characterCount < 5) {
    errors.push('Have at least 5 unique characters in your password');
  }

  if (/password/i.test(password)) {
    errors.push('Cannot have the word "password" in your password.');
  }

  if (topPasswords[password]) {
    errors.push('You are trying to use one of the top 10,000 most common passwords. Please choose a better password.');
  }

  return errors;
};

userSchema.statics.hashPassword = function(user) {
  if (!user.password) { return; }

  user.salt = crypto.randomBytes(32).toString('hex');
  user.password = hash(user.password, user.salt);
};

userSchema.methods.isPassword = function(password) {
  if (!password) { return false; }
  if (!this.salt || !this.password) { return false; }

  return hash(password, this.salt) === this.password;
};

const User = mongoose.model('User', userSchema);

log(User.validatePassword('aaaaaaaaaaa'));
log(User.validatePassword('password123'));
log(User.validatePassword('collect'));
log(User.validatePassword('POSINDFpsnos8792!#$OMG?'));

module.exports = User;
