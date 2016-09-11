'use strict';

module.exports = Emitter;

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var TRANSLATE_EVENTS = {
  'error': '_error'
};

function Emitter() {
  this._emitter = new EventEmitter();

  _.bindAll(this, [
    'on',
    'off',
    'emit'
  ]);
}

Emitter.prototype.on = function(eventName, listener) {
  eventName = translateEventName(eventName);

  this._emitter.on(eventName, listener);
};

Emitter.prototype.off = function(eventName, listener) {
  eventName = translateEventName(eventName);

  // Remove all listeners
  if (_.isUndefined(eventName)) {
    return this._emitter.removeAllListeners();
  }

  // Remove all listeners for the given eventName
  if (_.isUndefined(listener)) {
    return this._emitter.removeAllListeners([eventName]);
  }

  // Remove all listeners for the given eventname & listener
  this._emitter.removeListener(eventName, listener);
};

Emitter.prototype.emit = function() {
  arguments[0] = translateEventName(arguments[0]);
  this._emitter.emit.apply(this._emitter, arguments);
};

function translateEventName(eventName) {
  return !_.has(TRANSLATE_EVENTS, eventName) ? eventName :
    TRANSLATE_EVENTS[eventName];
}
