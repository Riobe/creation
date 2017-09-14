// To actually trigger Vue, it's implemented as a constructor called for it's
// side effect. (Which is why we have jshint ignore the line)
new Vue({ 
  el: '#body',
  data: {
    title: 'Hello Vue!'
  }
});
