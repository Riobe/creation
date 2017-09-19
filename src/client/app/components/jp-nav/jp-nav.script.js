'use strict';

import jpModal from '../jp-modal/jp-modal.vue';

const notifyService = require('../../services/notify.service.js');

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
    login: function() {
      this.user = {
        userName: this.loginForm.userName
      };
      notifyService.publish('notify', {
        classes: 'success',
        title: 'Success',
        message: `You are logged in as ${this.user.userName}!`
      });
    }
  },
  components: {
    jpModal
  }
};
