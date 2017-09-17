'use strict';

const debug = require('debug')('jeremypridemore-me:app');

import jpSite from './jp-site/jp-site.vue';
import Vue from 'vue';

debug('Instantiating Vue.js');

// To actually trigger Vue, it's implemented as a constructor called for it's
// side effect. (Which is why we have jshint ignore the line)
new Vue({ // jshint ignore:line
  el: '#body',
  // At some point, need to figure out the virtual DOM enough to understand wtf
  // this does. Why was the example "h" of all things?
  render: h => h(jpSite)
});
