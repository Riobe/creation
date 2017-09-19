'use strict';

const debug = require('debug')('jeremypridemore-me:components:jp-modal');

debug('Exporting jp-nav component.');
export default {
  methods: {
    close: function() {
      debug('Closing modal.');
      this.$emit('close');
    },
    closeOnEsc: function(event) {
      if (event.key === 'Escape') {
        debug('Escape pressed.');
        this.close();
      }
    }
  },
  mounted: function() {
    debug('Vue Event: mounted');
    window.addEventListener('keyup', this.closeOnEsc);
  },
  beforeDestroy: function() {
    debug('Vue Event: beforeDestroy');
    window.removeEventListener('keyup', this.closeOnEsc);
  }
};
