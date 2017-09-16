'use strict';

const crypto = require('crypto'),
      pbkdf2 = require('pbkdf2'),
      mongoose = require('mongoose'),
      topPasswords = require('../utility/top-10k-passwords'),
      log = require('debug')('jeremypridemore-me:models:user');

log('Defining User model.');

// jscs:disable maximumLineLength
const emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // jshint ignore:line
// jscs:enable maximumLineLength

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  salt: String,
  email: String
});

function hash(password, salt) {
  return pbkdf2.pbkdf2Sync(password, salt, 10, 128, 'sha512').toString('hex');
}

userSchema.statics.hashPassword = function(user) {
  if (!user.password) { return; }

  user.salt = crypto.randomBytes(32).toString('hex');
  user.password = hash(user.password, user.salt);
};

userSchema.methods.validateUserName = function() {
  if (!this.userName) {
    return 'Cannot make a user with no user name.';
  }

  if (this.userName.length < 5) {
    return 'Your user name has to be 5 characters or greater.';
  }
};

userSchema.methods.validatePassword = function() {
  if (!this.password) {
    return 'Cannot make a user with no password.';
  }

  if (this.password.length < 10) {
    return 'Your password must be 10 or more characters long.';
  }

  if (this.password.length > 30) {
    return 'Your password must be 30 or less characters long, though kudos for trying a huge one.';
  }

  const characterCount = this.password
    .split('')
    .filter((character, i, array) => array.indexOf(character) === i)
    .length;

  if (characterCount < 5) {
    return 'Have at least 5 unique characters in your password';
  }

  if (/password/i.test(this.password)) {
    return 'Cannot have the word "password" in your password.';
  }

  if (topPasswords[this.password]) {
    return 'You are trying to use one of the top 10,000 most common passwords. Please choose a less common password.';
  }

  if (new RegExp(this.userName, 'i').test(this.password)) {
    return 'You cannot have your user name in your password.';
  }

  const emailAccount = this.email.match(/[^@]+/)[0],
        emailAccountNoSpecial = emailAccount.match(/\w*/g).join('');
  if (new RegExp(emailAccountNoSpecial, 'i').test(this.password) ||
    this.password.indexOf(emailAccount) > -1
  ) {
    return 'You cannot have your email account in your password.';
  }
};

userSchema.methods.validateEmail = function() {
  if (!emailRegex.test(this.email)) {
    return 'Invalid email address.';
  }
};

userSchema.methods.isPassword = function(password) {
  if (!password) { return false; }
  if (!this.salt || !this.password) { return false; }

  return hash(password, this.salt) === this.password;
};

const User = mongoose.model('User', userSchema);

const riobe = new User({
  email: 'jeremy.pridemore@gmail.com'
});

log('Validate email:', riobe.validateEmail());

module.exports = User;
