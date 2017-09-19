'use strict';

const debug = require('debug')('jeremypridemore-me:app');
const loginService = require('./services/login.service');

import jpSite from './components/jp-site/jp-site.vue';
import Vue from 'vue';

function instantiateVue() {
  debug('Instantiating Vue.js');
  // To actually trigger Vue, it's implemented as a constructor called for it's
  // side effect. (Which is why we have jshint ignore the line)
  new Vue({ // jshint ignore:line
    el: '#body',
    // At some point, need to figure out the virtual DOM enough to understand wtf
    // this does. Why was the example "h" of all things?
    render: h => h(jpSite)
  });
}

// We want to instantiate Vue no matter what.
loginService.checkLogin()
  .then(instantiateVue)
  .catch(instantiateVue);
