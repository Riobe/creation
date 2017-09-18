'use strict';

import jpModal from '../jp-modal/jp-modal.vue';

const toastr = require('toastr');

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
      toastr.success('You are logged in as ' + this.user.userName, 'Success');
    }
  },
  components: {
    jpModal
  }
};
