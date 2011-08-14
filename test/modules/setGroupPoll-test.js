(function() {
  var Curator, assert, setGroupPoll, vows, watchGroup;
  vows = require('vows');
  assert = require('assert');
  setGroupPoll = require('curator/lib/modules/setGroupPoll');
  Curator = require('curator');
  watchGroup = Curator.newWatchGroup(function() {
    this.name = 'test-setGroupPoll';
    this.startCommand = 'node';
    this.startProcesses = 2;
    this.checkInterval = 80;
    return setGroupPoll(this);
  });
  vows.describe('modules/setGroupPoll').addBatch({
    'setGroupPoll function': {
      topic: null,
      'is a function': function() {
        return assert.isFunction(setGroupPoll);
      },
      '| a watchGroup instace with setGroupPoll applied after start': {
        topic: function() {
          vows = this;
          watchGroup.once('new-stat', function() {
            return watchGroup.once('new-stat', vows.callback);
          });
          watchGroup.start();
        },
        'should have .stat': function() {
          return assert.isObject(watchGroup.stat);
        },
        'should have .stat.mem': function() {
          return assert.isTrue(watchGroup.stat.total_mem > 0);
        },
        'should have .stat.pmem': function() {
          return assert.isTrue(watchGroup.stat.total_pmem > 0);
        },
        'should have .stat.pcpu': function() {
          return assert.isTrue(watchGroup.stat.total_pcpu >= 0);
        },
        'should have .stat.ipcpu': function() {
          return assert.isTrue(watchGroup.stat.total_ipcpu >= 0);
        },
        '| call `.stop()` on watchGroup instance': {
          topic: function() {
            watchGroup.once('non-running', this.callback);
            watchGroup.stop();
          },
          'should be stoped': function() {
            return assert.strictEqual(watchGroup.running, 0);
          },
          '| restart the instance and run the test again': {
            topic: function() {
              vows = this;
              watchGroup.stat.total_mem = watchGroup.stat.total_pmem = 0;
              watchGroup.stat.total_pcpu = watchGroup.stat.total_ipcpu = -1;
              watchGroup.once('new-stat', function() {
                return watchGroup.once('new-stat', vows.callback);
              });
              watchGroup.start();
            },
            'should have correct stats again:': function() {
              assert.isObject(watchGroup.stat);
              assert.isTrue(watchGroup.stat.total_mem > 0);
              assert.isTrue(watchGroup.stat.total_pmem > 0);
              assert.isTrue(watchGroup.stat.total_pcpu >= 0);
              return assert.isTrue(watchGroup.stat.total_ipcpu >= 0);
            },
            '| call `.stop()` on watchGroup instance again': {
              topic: function() {
                watchGroup.once('non-running', this.callback);
                watchGroup.stop();
              },
              'should be stoped again': function() {
                return assert.strictEqual(watchGroup.running, 0);
              }
            }
          }
        }
      }
    }
  })["export"](module);
}).call(this);
