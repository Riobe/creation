'use strict';

import jpNotify from '../jp-notify/jp-notify.vue';
import jpNav from '../jp-nav/jp-nav.vue';

export default {
  components: {
    jpNav,
    jpNotify
  },
  data: function() {
    return {
      title: 'Hello Vue!!!'
    };
  }
};
