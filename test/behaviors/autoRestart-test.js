var vows = require('vows');
var assert = require('assert');

// Make our test instances global because object passing in vows is hell.
// Until another solution comes up, we assum here that instance creation won't
// fail.
var Curator = require('curator');

var autoRestart = require('curator/lib/behaviors/autoRestart');

var watch = Curator.newWatch(function () {
  this.name = 'test-autorestart';
  this.startCommand = 'date';
  this.maxRetry = 3;
  autoRestart(this);
});

vows.describe('behaviors/autoRstart').addBatch({
  'A watch instance with `maxRetry` set to 3 and `autoRstart(this)` applied after start': {
    topic: function () {
      watch.on('max-retry-reached', this.callback);
      watch.start();
    },
    'has count of 3': function () {
      assert.equal(watch.count, 3);
    }
  }
}).export(module);
