(function() {
  var Curator, assert, vows, watchGroup;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  watchGroup = Curator.newWatchGroup(function() {
    this.name = 'test-group';
    this.startProcesses = 2;
    return this.startCommand = 'node';
  });
  vows.describe('core/watchGroup.js').addBatch({
    'A watchGroup instance': {
      topic: watchGroup,
      'is an object': function() {
        return assert.isObject(watchGroup);
      },
      'is an instance of Curator.WatchGroup': function() {
        return assert.isTrue(watchGroup instanceof Curator.WatchGroup);
      },
      'responds to start': function() {
        return assert.isFunction(watchGroup.start);
      },
      'responds to stop': function() {
        return assert.isFunction(watchGroup.stop);
      },
      'responds to create': function() {
        return assert.isFunction(watchGroup.create);
      },
      'responds to spawn': function() {
        return assert.isFunction(watchGroup.spawn);
      },
      'has a list of watch instances': function() {
        return assert.isArray(watchGroup.watchList);
      },
      '| after `.start()` on all-running event': {
        topic: function() {
          watchGroup.once('all-running', this.callback);
          watchGroup.start();
        },
        'has two watch instances in watchList': function() {
          return assert.equal(watchGroup.watchList.length, 2);
        },
        'has all processes running': function() {
          return watchGroup.watchList.forEach(function(watch) {
            return assert.isTrue(watch.running);
          });
        },
        '| after `.create(2)` and `.start()` on all-running event': {
          topic: function() {
            watchGroup.once('all-running', this.callback);
            watchGroup.create(2);
            watchGroup.start();
          },
          'has two more watch instances': function() {
            return assert.equal(watchGroup.watchList.length, 4);
          },
          '| after `.spawn(2)` on all-running event': {
            topic: function() {
              watchGroup.once('all-running', this.callback);
              return watchGroup.spawn(2);
            },
            'has two more watch instances': function() {
              return assert.equal(watchGroup.watchList.length, 6);
            },
            '| after `.stop()` and on non-running event': {
              topic: function() {
                watchGroup.on('non-running', this.callback);
                watchGroup.stop();
              },
              'has no running children': function() {
                return watchGroup.watchList.forEach(function(watch) {
                  return assert.isFalse(watch.running);
                });
              },
              'has running process count zero': function() {
                return assert.equal(watchGroup.running, 0);
              }
            }
          }
        }
      }
    }
  })["export"](module);
}).call(this);
