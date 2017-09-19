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
      loggingIn: true,
      registering: false,
      user: undefined
    };
  },
  methods: {
    register: function() {
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

      userService.register(this.registerForm)
        .then(res => {
          notifySuccess(`Created ${this.registerForm.userName}!`);
          debug(res.data);

          this.registerForm = {
            userName: undefined,
            password: undefined,
            email: undefined
          };

          this.registering = false;
        })
        .catch(err => {
          notifyError(`Well shit, something went wrong making ${this.registerForm.userName}.`);
          debug(err);
        });
    },
    login: function() {
      debug(this.loginForm);
      if (userValidation.validatePassword(this.loginForm.password, this.loginForm.userName)) {
        notifyError('Nope, not a valid password. Try again.');
        return;
      }

      loginService.login(this.loginForm.userName, this.loginForm.password)
        .then(res => {
          notifySuccess(`Logged in as ${this.loginForm.userName}!`);
          debug(res.data);

          this.loginForm = {
            userName: undefined,
            password: undefined
          };

          this.loggingIn = false;
        })
        .catch(err => {
          notifyError('Invalid user name or password.');
          debug(err);
        });
    }
  },
  components: {
    jpModal
  }
};
