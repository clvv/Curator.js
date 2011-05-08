var vows = require('vows');
var assert = require('assert');

var procPoller = require('curator/lib/system/procPoller');

vows.describe('system/procPoller').addBatch({
  'The procPoller': {
    topic: function () {
      return procPoller;
    },
    'has a poll function': function () {
      assert.isFunction(procPoller.poll);
    },
    'after called with this process\' pid': {
      topic: function () {
        procPoller.poll(process.pid, this.callback);
      },
      'return no error, and a valid stat': function (err, stat) {
        assert.isNull(err);
        assert.isObject(stat);
      },
      'returned stat is not empty': function (err, stat) {
        assert.isNotZero(stat);
      },
      'returned stat has a mem close to node\'s `memoryUsage().rss`': function (err, stat) {
        mem = process.memoryUsage().rss / 1024;
        value = Math.abs(mem - stat.mem) / mem
        bool = value < 0.08
        if ( !bool ) {
          console.log('');
          console.log('Fail stats:');
          console.log('mem: ' + mem + ' ; stat.mem: ' + stat.mem);
          console.log('Math.abs(mem - stat.mem) / mem : ' + value);
        }
        assert.isTrue( bool );
      },
      'returned stat has correct pmem': function (err, stat) {
        assert.isTrue( stat.pmem > 0 );
      },
      'returned stat has correct pcpu': function (err, stat) {
        assert.isTrue( stat.pcpu > 0 );
      },
    }
  }
}).export(module);
