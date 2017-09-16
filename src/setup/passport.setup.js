'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('../models/user'),
      log = require('debug')('jeremypridemore-me:setup:passport');

log('Configuring passport local strategy.');

const options = {
  usernameField: 'userName'
};

function localAuth(userName, password, done) {
  log(`Attempting to find user for: ${userName}`);
  User.findOne({ userName }, function(err, user) {
    if (err) {
      log(`ERROR in LocalStrategy: ${err}`);
      return done(err);
    }

    if (!user) {
      log(`Could not find user: ${userName}`);
      return done(null, false, { message: 'Incorrect user name or password' });
    }

    if (!user.isPassword(password)) {
      log(`Incorrect password for user: ${userName}`);
      return done(null, false, { message: 'Incorrect user name or password' });
    }

    log('Found user!');
    return done(null, user);
  });
}

const localStrategy = new LocalStrategy(options, localAuth);

passport.serializeUser((user, done) => {
  done(null, user.userName);
});

passport.deserializeUser((id, done) => {
  User.find({userName: id}, (err, user) => {
    done(err, user);
  });
});

passport.use(localStrategy);

exports.localStrategy = localStrategy;
