'use strict';

const crypto = require('crypto'),
      pbkdf2 = require('pbkdf2'),
      mongoose = require('mongoose'),
      validation = require('./user.validation'),
      log = require('debug')('jeremypridemore-me:models:user');

log('Defining User model.');

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

userSchema.statics.validateUserName = validation.validateUserName;
userSchema.statics.validatePassword = validation.validatePassword;
userSchema.statics.validateEmail = validation.validateEmail;

userSchema.methods.isPassword = function(password) {
  if (!password) { return false; }
  if (!this.salt || !this.password) { return false; }

  return hash(password, this.salt) === this.password;
};

module.exports = mongoose.model('User', userSchema);

/* Indexes
db.users.createIndex({
  userName: 1
}, {
  name: 'ux_userName',
  unique: true,
  collation: {
    locale: 'en',
    strength: 2
  }
})
*/
