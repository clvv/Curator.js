var vows = require('vows');
var assert = require('assert');

// Make our test instances global because object passing in vows is hell.
// Until another solution comes up, we assum here that instance creation won't
// fail.
var Curator = require('curator');

var setInterval = require('curator/lib/behaviors/setInterval');

var watch = Curator.newWatch(function () {
    this.name = 'test-watch';
    this.startCommand = 'node';
    this.called = false;
    setInterval(this, function () {
        if ( ! this.called) {
            this.called = true;
            this.stop();
        }
    }, 0);
});

var watchWithStartGrace = Curator.newWatch(function () {
    this.name = 'test-watch';
    this.startCommand = 'node';
    this.called = false;
    this.on('started', Curator.helpers.stopper);
    Curator.setInterval(this, function (watch) {
        this.called = true; // This shouldn't be called
        this.stop();
    }, 0, 1000);
});

vows.describe('behaviors/setInterval').addBatch({
    'A watch instance with `setInterval(this, callback, 0)` applied': {
        topic: function () {
            return watch;
        },
        'has clearIntervals function': function () {
            assert.isFunction(watch.clearIntervals);
        },
        'has clearTimouts function': function () {
            assert.isFunction(watch.clearTimeouts);
        },
        '| after .start()': {
            topic: function () {
                watch.on('exit', this.callback);
                watch.start()
            },
            'callback should be called': function () {
                assert.isTrue(this.called);
            }
        }
    },
    'A watch instance with `setInterval(this, callback, 0, 1000)` applied after start': {
        topic: function () {
            watchWithStartGrace.on('exit', this.callback);
            watchWithStartGrace.start();
        },
        'callback shouldn\'t be called': function () {
            assert.isFalse(this.called);
        }
    }
}).export(module);
