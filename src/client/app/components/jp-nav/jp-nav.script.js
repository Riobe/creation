'use strict';

import jpModal from '../jp-modal/jp-modal.vue';

export default {
  data: function() {
    return {
      loggingIn: true,
      registering: false
    };
  },
  components: {
    jpModal
  }
};
