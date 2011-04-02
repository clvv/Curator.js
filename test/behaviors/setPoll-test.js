var vows = require('vows');
var assert = require('assert');

var setPoll = require('curator/lib/behaviors/setPoll');

var Curator = require('curator');
var watch = Curator.newWatch(function () {
    this.name = 'test-setPoll';
    this.startCommand = 'node';
    this.checkInterval = 50;
    setPoll(this);
});


vows.describe('behaviors/setPoll').addBatch({
    'setPoll function': {
        topic: function () {
            return setPoll;
        },
        'is a function': function (setPoll) {
            assert.isFunction(setPoll);
        },
        '| a watch instace with setPoll applied after start': {
            topic: function () {
                vows = this;
                watch.once('new-stat', function () {
                    watch.once('new-stat', vows.callback);
                });
                watch.start();
            },
            'should have .stat': function () {
                assert.isObject(watch.stat);
            },
            'should have .stat.ipcpu': function () {
                bool = (watch.stat.ipcpu >= 0)
                if ( ! bool ) {
                    console.log('');
                    console.log('Fail stats:');
                    console.log('watch.stat.ipcpu: ' + watch.stat.ipcpu);
                }
                assert.isTrue(bool);
            }
        }
    }
}).export(module);
