(function() {
  var Curator, assert, vows, watch;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  watch = Curator.newWatch(function() {
    this.name = 'test-watch';
    return this.startCommand = 'node';
  });
  vows.describe('core/watch.js').addBatch({
    'A watch instance': {
      topic: watch,
      'is a object': function() {
        return assert.isObject(watch);
      },
      'responds to start': function() {
        return assert.isFunction(watch.start);
      },
      'responds to stop': function() {
        return assert.isFunction(watch.stop);
      },
      'has a null pid': function() {
        return assert.isNull(watch.pid);
      },
      'is not running': function() {
        return assert.isFalse(watch.running);
      },
      '| after `.start()` on started event': {
        topic: function() {
          watch.on('started', this.callback);
          watch.start();
        },
        'has a pid': function() {
          return assert.ok(watch.pid);
        },
        'has a writable stdin stream': function() {
          return assert.isTrue(watch.stdin.writable);
        },
        'has readable stdout, stderr streams': function() {
          assert.isTrue(watch.stdout.readable);
          return assert.isTrue(watch.stderr.readable);
        },
        '| after .stop() on exit event': {
          topic: function() {
            watch.on('exit', this.callback);
            watch.stop();
          },
          'is not running': function() {
            return assert.isFalse(watch.running);
          },
          'has a null pid': function() {
            return assert.isNull(watch.pid);
          },
          'has no readable or writable streams': function() {
            assert.isFalse(watch.stdin.writable);
            assert.isFalse(watch.stdout.readable);
            return assert.isFalse(watch.stderr.readable);
          }
        }
      }
    }
  })["export"](module);
}).call(this);
