var vows = require('vows');
var assert = require('assert');

// Make our test instances global because object passing in vows is hell.
// Until another solution comes up, we assum here that instance creation won't
// fail.
var Curator = require('curator');
var watch = Curator.newWatch(function () {
    this.name = 'test-watch';
    this.startCommand = 'node';
});

vows.describe('core/watch.js').addBatch({
    'A watch instance': {
        topic: watch,
        'is a object': function () {
            assert.isObject(watch);
        },
        'responds to start': function () {
            assert.isFunction(watch.start);
        },
        'responds to stop': function () {
            assert.isFunction(watch.stop);
        },
        'has a null pid': function () {
            assert.isNull(watch.pid);
        },
        'is not running': function () {
            assert.isFalse(watch.running);
        },
        '| after `.start()` on started event': {
            topic: function () {
                watch.on('started', this.callback);
                watch.start();
            },
            'has a pid': function () {
                assert.ok(watch.pid);
            },
            'has a writable stdin stream': function () {
                assert.isTrue(watch.stdin.writable);
            },
            'has readable stdout, stderr streams': function () {
                assert.isTrue(watch.stdout.readable);
                assert.isTrue(watch.stderr.readable);
            },
            '| after .stop() on exit event': {
                topic: function () {
                    watch.on('exit', this.callback);
                    process.nextTick(Curator.helpers.stopper.bind(watch));
                },
                'is not running': function () {
                    assert.isFalse(watch.running);
                },
                'has a null pid': function () {
                    assert.isNull(watch.pid);
                },
                'has no readable or writable streams': function () {
                    assert.isFalse(watch.stdin.writable);
                    assert.isFalse(watch.stdout.readable);
                    assert.isFalse(watch.stderr.readable);
                }
            }
        }
    }
}).export(module);
