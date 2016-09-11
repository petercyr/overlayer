var watchr = require('watchr');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Emitter = require('./emitter');

var LABEL_DIR = path.resolve(__dirname + '/../../label-data');

function Watcher() {
  console.log('Watching files in: ', LABEL_DIR);

  this._emitter = new Emitter();

  _.bindAll(this, [
    '_handleFileChange'
  ]);
};

Watcher.prototype.init = function() {
  watchr.watch({
    path: LABEL_DIR,
    listeners: {
        log: function (logLevel) {
            //console.log('a log message occured:', arguments);
        },
        error: function (err) {
            //console.log('an error occured:', err);
        },
        watching: function (err, watcherInstance, isWatching){
            if (err) {
                //console.log("watching the path " + watcherInstance.path + " failed with error", err)
            } else {
                //console.log("watching the path " + watcherInstance.path + " completed")
            }
        },
        change: this._handleFileChange
    },
    next: function(err, watchers){
        if (err) {
            return console.log("watching everything failed with error", err)
        } else {
            // console.log('watching everything completed', watchers)
        }

        // Close watchers after 60 seconds
        setTimeout(function () {
            console.log('Stop watching our paths')
            for ( var i = 0; i < watchers.length; i++ ) {
                watchers[i].close()
            }
        }, 60 * 1000)
    }
  });
};

Watcher.prototype.on = function(eventName, listener) {
  this._emitter.on(eventName, listener);
};

Watcher.prototype.off = function(eventName, listener) {
  this._emitter.off(eventName, listener);
};

Watcher.prototype._handleFileChange = function(changeType, filePath, fileCurrentState, filePreviousState) {
  if (changeType === 'update') {
    this._emitter.emit('update', filePath);
  }
};

module.exports = Watcher;
