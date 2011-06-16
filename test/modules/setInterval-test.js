(function() {
  var Curator, assert, setInterval, vows, watch, watchWithStartGrace;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  setInterval = require('curator/lib/modules/setInterval');
  watch = Curator.newWatch(function() {
    this.name = 'test-watch';
    this.startCommand = 'node';
    this.called = false;
    return setInterval(this, function() {
      if (!this.called) {
        this.called = true;
        return this.stop();
      }
    }, 0);
  });
  watchWithStartGrace = Curator.newWatch(function() {
    this.name = 'test-watch';
    this.startCommand = 'node';
    this.called = false;
    this.on('started', Curator.helpers.stopper);
    return Curator.setInterval(this, function(watch) {
      this.called = true;
      return this.stop();
    }, 0, 1000);
  });
  vows.describe('modules/setInterval').addBatch({
    'A watch instance with `setInterval(this, callback, 0)` applied': {
      topic: function() {
        return watch;
      },
      'has clearIntervals function': function() {
        return assert.isFunction(watch.clearIntervals);
      },
      'has clearTimouts function': function() {
        return assert.isFunction(watch.clearTimeouts);
      },
      '| after .start()': {
        topic: function() {
          watch.on('exit', this.callback);
          watch.start();
        },
        'callback should be called': function() {
          return assert.isTrue(watch.called);
        }
      }
    },
    'A watch instance with `setInterval(this, callback, 0, 1000)` applied after start': {
      topic: function() {
        watchWithStartGrace.on('exit', this.callback);
        return watchWithStartGrace.start();
      },
      'callback shouldn\'t be called': function() {
        return assert.isFalse(watchWithStartGrace.called);
      }
    }
  })["export"](module);
}).call(this);
