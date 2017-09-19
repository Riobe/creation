'use strict';

const debug = require('debug')('jeremypridemore-me:services:users');

const channels = {};

function subscribe(to, handler) {
  channels[to] = channels[to] || [];

  channels[to].push(handler);
}

function unsubscribe(to, handler) {
  if (!channels[to]) {
    return;
  }

  const index = channels[to].indexOf(handler);

  if (index === -1) {
    return;
  }

  return channels[to].splice(index, 1);
}

function publish(to, event) {
  if (!channels[to]) {
    return;
  }

  channels[to].forEach(handler => handler(event));
}

function clear(channel) {
  return delete channels[channel];
}

debug('Exporting notify service.');
module.exports = {
  subscribe,
  unsubscribe,
  publish,
  clear
};
