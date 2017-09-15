const debug = require('debug')('jeremypridemore-me:app');

debug('Instantiating Vue.js');

// To actually trigger Vue, it's implemented as a constructor called for it's
// side effect. (Which is why we have jshint ignore the line)
new Vue({ // jshint ignore:line
  el: '#body',
  data: {
    title: 'Hello Vue!!!'
  }
});
