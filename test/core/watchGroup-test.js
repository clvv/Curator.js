var vows = require('vows');
var assert = require('assert');

// Make our test instances global because object passing in vows is hell.
// Until another solution comes up, we assum here that instance creation won't
// fail.
var Curator = require('curator');
var watchGroup = Curator.newWatchGroup(function () {
    this.name = 'test-group';
    this.startProcesses = 2;
    this.startCommand = 'node';
});

vows.describe('core/watchGroup.js').addBatch({
    'A watchGroup instance': {
        topic: watchGroup,
        'is an object': function () {
            assert.isObject(watchGroup);
        },
        'responds to start': function () {
            assert.isFunction(watchGroup.start);
        },
        'responds to stop': function () {
            assert.isFunction(watchGroup.stop);
        },
        'responds to create': function () {
            assert.isFunction(watchGroup.create);
        },
        'responds to spawn': function () {
            assert.isFunction(watchGroup.spawn);
        },
        'has a list of watch instances': function () {
            assert.isArray(watchGroup.watchList);
        },
        '| after `.start()` on all-running event': {
            topic: function () {
                watchGroup.once('all-running', this.callback);
                watchGroup.start();
            },
            'has two watch instances in watchList': function () {
                assert.equal(watchGroup.watchList.length, 2);
            },
            'has all processes running': function () {
                watchGroup.watchList.forEach(function (watch) {
                    assert.isTrue(watch.running);
                });
            },
            '| after `.create(2)` and `.start()` on all-running event': {
                topic: function () {
                    watchGroup.once('all-running', this.callback);
                    watchGroup.create(2);
                    watchGroup.start();
                },
                'has two more watch instances': function () {
                    assert.equal(watchGroup.watchList.length, 4);
                },
                '| after `.spawn(2)` on all-running event': {
                    topic: function () {
                        watchGroup.once('all-running', this.callback);
                        watchGroup.spawn(2);
                    },
                    'has two more watch instances': function () {
                        assert.equal(watchGroup.watchList.length, 6);
                    },
                    '| after `.stop()` and on non-running event': {
                        topic: function () {
                            watchGroup.on('non-running', this.callback);
                            watchGroup.stop();
                        },
                        'has no running children': function () {
                            watchGroup.watchList.forEach(function (watch) {
                                assert.isFalse(watch.running);
                            });
                        },
                        'has running process count zero': function () {
                            assert.equal(watchGroup.running, 0);
                        }
                    }
                }
            }
        }
    }
}).export(module);
