'use strict';

const crypto = require('crypto'),
      pbkdf2 = require('pbkdf2'),
      mongoose = require('mongoose'),
      log = require('debug')('jeremypridemore-me:models:user');

log('Defining User model.');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  email: String
});

function hashPassword(password, salt) {
  return pbkdf2.pbkdf2Sync(password, salt, 10, 128, 'sha512').toString('hex');
}

userSchema.methods.rehashPassword = function() {
  if (!this.password) { return; }

  this.salt = crypto.randomBytes(32).toString('hex');
  this.password = hashPassword(this.password, this.salt);
};

userSchema.methods.isPassword = function(password) {
  if (!password) { return false; }
  if (!this.salt || !this.password) { return false; }

  return hashPassword(password, this.salt) === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
