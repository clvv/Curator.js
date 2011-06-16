(function() {
  var Curator, assert, autoRestart, vows, watch;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  autoRestart = require('curator/lib/modules/autoRestart');
  watch = Curator.newWatch(function() {
    this.name = 'test-autorestart';
    this.startCommand = 'date';
    this.maxRetry = 3;
    return autoRestart(this);
  });
  vows.describe('modules/autoRstart').addBatch({
    'A watch instance with `maxRetry` set to 3 and `autoRstart(this)` applied after start': {
      topic: function() {
        watch.once('max-retry-reached', this.callback);
        watch.start();
      },
      'has count of 3': function() {
        return assert.equal(watch.count, 3);
      },
      '| restart the instance and run the test again': {
        topic: function() {
          watch.emit('reset');
          watch.once('max-retry-reached', this.callback);
          watch.start();
        },
        'has count of 3': function() {
          return assert.equal(watch.count, 3);
        }
      }
    }
  })["export"](module);
}).call(this);
