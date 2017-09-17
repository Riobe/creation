'use strict';

const { expect } = require('chai'),
      User = require('./user');

describe('User', function() {
  let user;
  beforeEach(function() {
    user = new User();
  });

  describe('.hashPassword', function() {
    it('should not set the salt if there is no password.', function() {
      User.hashPassword(user);

      expect(user.salt).to.be.undefined;
    });

    it('should set the salt to a value if undefined.', function() {
      user.password = 'user-testing';

      User.hashPassword(user);

      expect(user.salt).to.be.ok;
    });

    it('should set the hash to something new if already set.', function() {
      let originalSalt = user.salt = 'test';
      user.password = 'user-testing';

      User.hashPassword(user);

      expect(user.salt).to.not.equal(originalSalt);
    });
  });

  describe('#validateUserName', function() {
    it('should return undefined if there is a valid user name..', function() {
      user.userName = 'riobe';

      let error = user.validateUserName();

      expect(error).to.be.undefined;
    });

    it('should return an error message if there is no user name.', function() {
      let error = user.validateUserName();

      expect(error).to.be.a('string');
    });

    it('should return an error message if the user name is less than 5 characters.', function() {
      user.userName = 'rio';

      let error = user.validateUserName();

      expect(error).to.be.a('string');
    });
  });

  //describe('#validatePassword', function() {
  //});

  //describe('#validateEmail', function() {
  //});
});
