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

  vows.describe('modules/cond').addBatch({
    'cond function': {
      topic: function() {
        return watch.cond;
      },
      'is a function': function(cond) {
        return assert.isFunction(cond);
      },
      '| a watch instace with a cond to callback applied after start': {
        topic: function() {
          watch.once('cond-test', this.callback);
          watch.cond((function() {
            return true;
          }), [2, 3], function() {
            return this.emit('cond-test', true);
          });
          watch.start();
        },
        'callback should be called': function(val) {
          assert.equal(watch.timelines[0].length(), 2);
          return watch.stop();
        },
        '| restart the watch instance and run the same test agagin': {
          topic: function() {
            vows = this;
            watch.once('exit', function() {
              watch.once('cond-test', vows.callback);
              return watch.start();
            });
          },
          'callback should be called': function(val) {
            watch.stop();
            return assert.isTrue(val);
          }
        }
      }
    }
  })["export"](module);

}).call(this);
