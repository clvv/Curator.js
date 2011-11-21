(function() {
  var Curator, assert, setPoll, vows, watch;

  vows = require('vows');

  assert = require('assert');

  setPoll = require('curator/lib/modules/setPoll');

  Curator = require('curator');

  watch = Curator.newWatch(function() {
    this.name = 'test-setPoll';
    this.startCommand = 'node';
    this.checkInterval = 80;
    return setPoll(this);
  });

  vows.describe('modules/setPoll').addBatch({
    'setPoll function': {
      topic: function() {
        return setPoll;
      },
      'is a function': function(setPoll) {
        return assert.isFunction(setPoll);
      },
      '| a watch instace with setPoll applied after start': {
        topic: function() {
          vows = this;
          watch.once('new-stat', function() {
            return watch.once('new-stat', vows.callback);
          });
          watch.start();
        },
        'should have .stat': function() {
          return assert.isObject(watch.stat);
        },
        'should have .stat.ipcpu': function() {
          var bool;
          bool = watch.stat.ipcpu >= 0;
          if (!bool) {
            console.log('');
            console.log('Fail stats:');
            console.log("watch.stat.ipcpu: " + watch.stat.ipcpu);
          }
          assert.isTrue(bool);
          return watch.stop();
        }
      }
    }
  })["export"](module);

}).call(this);
