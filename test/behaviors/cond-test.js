(function() {
  var Curator, assert, vows, watch;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  watch = Curator.newWatch(function() {
    this.name = 'test-setPoll';
    this.startCommand = 'node';
    this.checkInterval = 80;
    return Curator.setPoll(this);
  });
  vows.describe('behaviors/cond').addBatch({
    'cond function': {
      topic: function() {
        return watch.cond;
      },
      'is a function': function(cond) {
        return assert.isFunction(cond);
      },
      '| a watch instace with a cond to callback applied after start': {
        topic: function() {
          vows = this;
          watch.cond((function() {
            return true;
          }), [2, 3], vows.callback);
          watch.start();
        },
        'callback should be called': function() {
          watch.stop();
          return assert.isTrue(true);
        }
      }
    }
  })["export"](module);
}).call(this);
