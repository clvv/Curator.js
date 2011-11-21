(function() {
  var Curator, assert, autoRestart, vows, watch, watch2;

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

  watch2 = Curator.newWatch();

  watch2.name = 'autorestart=test2';

  watch2.startCommand = 'date';

  watch2.exitTimes = 0;

  autoRestart(watch2);

  watch2.on('exit', function() {
    if (this.exitTimes++ > 5) {
      this.removeAllListeners('exit');
      return this.emit('reached', true);
    }
  });

  vows.describe('modules/autoRstart').addBatch({
    'A watch instance with `maxRetry` set to 3 and `autoRstart` applied after start': {
      topic: function() {
        watch.once('max-retry-reached', this.callback);
        watch.start();
      },
      'has count of 3': function() {
        return assert.equal(watch.count, 3);
      },
      '| restart the instance and run the test again': {
        topic: function() {
          watch.reset();
          watch.once('max-retry-reached', this.callback);
          watch.start();
        },
        'has count of 3': function() {
          return assert.equal(watch.count, 3);
        }
      }
    },
    'A watch instance with `autoRestart` applied after start': {
      topic: function() {
        watch2.once('reached', this.callback);
        watch2.start();
      },
      'should restart as many times as possible': function(val) {
        return assert.isTrue(val);
      }
    }
  })["export"](module);

}).call(this);
