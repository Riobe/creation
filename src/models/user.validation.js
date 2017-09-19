'use strict';

const topPasswords = require('../utility/top-10k-passwords');

// jscs:disable maximumLineLength
const emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // jshint ignore:line
// jscs:enable maximumLineLength

exports.validateUserName = function(userName) {
  if (!userName) {
    return 'You forgot the user name.';
  }

  if (userName.length < 4 || userName.length > 20) {
    return 'Your user name has to be between 4 and 20 characters long.';
  }

  if (!/^[a-z0-9-_]{4,20}$/i.test(userName)) {
    return 'Your user name must consist of letters, numbers, hyphens (-), or underscores (_).';
  }
};

exports.validatePassword = function(password, userName, email) {
  if (!password) {
    return 'There\'s no password here. Try again.';
  }

  if (password.length < 10) {
    return 'Your password must be at least 10 characters long. You can do better.';
  }

  if (password.length > 30) {
    return 'Your password must be 30 or less characters long, though kudos for trying a huge one.';
  }

  const characterCount = password
    .split('')
    .filter((character, i, array) => array.indexOf(character) === i)
    .length;

  if (characterCount < 5) {
    return 'Have at least 5 unique characters in your password. Stop trying to cheat.';
  }

  if (/password/i.test(password)) {
    return 'Cannot have the word "password" in your password. I mean....really...';
  }

  if (topPasswords[password]) {
    return 'You are trying to use one of the top 10,000 most common passwords. You can do better.';
  }

  if (new RegExp(userName, 'i').test(password)) {
    return 'You cannot have your user name in your password. You\'re not doing that anywhere... are you?';
  }

  let numberCount = password.match(/\d*/);
  if (numberCount && (numberCount[0].length === password.length)) {
    return 'Very clever, password can\'t be all numbers.';
  }

  // From the client we also need to be able to just validate without the email.
  if (!email) {
    return;
  }

  const emailAccount = email.match(/[^@]+/)[0],
    emailAccountNoSpecial = emailAccount.match(/\w*/g).join('');
  if (new RegExp(emailAccountNoSpecial, 'i').test(password) ||
    password.indexOf(emailAccount) > -1
  ) {
    return 'You cannot have your email account in your password. It\'s a bad idea.';
  }
};

exports.validateEmail = function(email) {
  if (!email) {
    return 'You forgot to give me an email. No I won\'t use it for anything you didn\'t trigger yourself.';
  }

  if (!emailRegex.test(email)) {
    return 'Invalid email address according to the longest regex I\'ve ever used...';
  }
};
