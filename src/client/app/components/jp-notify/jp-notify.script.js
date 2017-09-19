'use strict';

import jpNotification from './jp-notification.vue';

const debug = require('debug')('jeremypridemore-me:components:jp-notify');
const notifyService = require('../../services/notify.service.js');

debug('Exporting jp-notify component.');
export default {
  data: function() {
    return {
      notifications: []
    };
  },
  components: {
    jpNotification
  },
  methods: {
    receivedNotification: function(notification) {
      notification.id = Math.random();
      this.notifications.push(notification);
      setTimeout(() => {
        const index = this.notifications.indexOf(item => item.id === notification.id);
        this.notifications.splice(index, 1);
      }, 2000);
    }
  },
  created: function() {
    notifyService.subscribe('notify', this.receivedNotification);
  },
  beforeDestroy: function() {
    notifyService.unsubscribe('notify', this.receivedNotification);
  }
};
