'use strict';

import jpModal from '../jp-modal/jp-modal.vue';

const debug = require('debug')('jeremypridemore-me:components:jp-nav');
const userValidation = require('../../../../models/user.validation');
const notify = require('../../services/notify.service').channel('notify');
const userService = require('../../services/users.service');

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
      registering: true,
      user: undefined
    };
  },
  methods: {
    login: function() {
      this.user = {
        userName: this.loginForm.userName
      };
      notify({
        classes: 'success',
        title: 'Success',
        message: `You are logged in as ${this.user.userName}!`
      });
    },
    register: function() {
      let error = userValidation.validateUserName(this.registerForm.userName);
      if (error) {
        return notify({
          classes: 'error',
          title: 'Error',
          message: error
        });
      }

      error = userValidation.validateEmail(this.registerForm.email);
      if (error) {
        return notify({
          classes: 'error',
          title: 'Error',
          message: error
        });
      }

      error = userValidation.validatePassword(this.registerForm.password, this.registerForm.userName, this.registerForm.email);
      if (error) {
        return notify({
          classes: 'error',
          title: 'Error',
          message: error
        });
      }

      userService.register(this.registerForm)
        .then(response => {
          notify({
            classes: 'success',
            title: 'Success',
            message: `Created ${this.registerForm.userName}!`
          });
          debug(response.data);
          this.registering = false;
        })
        .catch(err => {
          notify({
            classes: 'error',
            title: 'Error',
            message: `Well shit, something went wrong making ${this.registerForm.userName}.`
          });
          debug(err);
        });
    }
  },
  components: {
    jpModal
  }
};
