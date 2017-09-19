'use strict';

import jpModal from '../jp-modal/jp-modal.vue';

const debug = require('debug')('jeremypridemore-me:components:jp-nav');
const userValidation = require('../../../../models/user.validation');
const notify = require('../../services/notify.service').channel('notify');
const userService = require('../../services/users.service');
const loginService = require('../../services/login.service');

const notifySuccess = message => {
  notify({
    classes: 'success',
    title: 'Success',
    message
  });
};

const notifyError = message => {
  notify({
    classes: 'error',
    title: 'Error',
    message
  });
};

debug('Exporting jp-nav component.');
export default {
  data: function() {
    return {
      registerForm: {
        userName: undefined,
        password: undefined,
        email: undefined
      },
      loginForm: {
        userName: undefined,
        password: undefined
      },
      loggingIn: false,
      registering: false,
      user: userService.current
    };
  },
  methods: {
    register: function() {
      debug('Attempting to register a new user.');
      let error = userValidation.validateUserName(this.registerForm.userName);
      if (error) {
        return notifyError(error);
      }

      error = userValidation.validateEmail(this.registerForm.email);
      if (error) {
        return notifyError(error);
      }

      error = userValidation.validatePassword(this.registerForm.password, this.registerForm.userName, this.registerForm.email);
      if (error) {
        return notifyError(error);
      }

      return userService.register(this.registerForm)
        .then(res => {
          notifySuccess(`Created ${this.registerForm.userName}!`);
          debug(res.data);

          this.login(this.registerForm.userName, this.registerForm.password).then(() => {
            this.registering = false;

            this.registerForm = {
              userName: undefined,
              password: undefined,
              email: undefined
            };
          });
        })
        .catch(err => {
          notifyError(`Well shit, something went wrong making ${this.registerForm.userName}.`);
          debug(err);
        });
    },
    login: function(userName, password) {
      debug('Attempting to login');
      userName = this.loginForm.userName || userName;
      password = this.loginForm.password || password;

      if (typeof userName === 'object') {
        debug('Login called with an object as userName. Probably an event. Fix this.');
        debug(userName);
        return;
      }

      if (userValidation.validatePassword(password, userName)) {
        notifyError('Nope, not a valid password. Try again.');
        return;
      }

      return loginService.login(userName, password)
        .then(res => {
          notifySuccess('Logged in.');
          debug(res.data);

          this.loginForm = {
            userName: undefined,
            password: undefined
          };

          this.loggingIn = false;

          this.user = {
            userName
          };
        })
        .catch(err => {
          notifyError('Invalid user name or password.');
          debug(err);
        });
    },
    logout: function() {
      return loginService.logout().then(() => this.user = undefined);
    }
  },
  components: {
    jpModal
  }
};
