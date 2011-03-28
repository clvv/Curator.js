var vows = require('vows');
var assert = require('assert');

var setGroupPoll = require('curator/lib/behaviors/setGroupPoll');

var Curator = require('curator');
var watchGroup = Curator.newWatchGroup(function () {
    this.name = 'test-setGroupPoll';
    this.startCommand = 'node';
    this.startProcesses = 2;
    this.checkInterval = 40;
    setGroupPoll(this);
});


vows.describe('behaviors/setGroupPoll').addBatch({
    'setGroupPoll function': {
        topic: function () {
            return setGroupPoll;
        },
        'is a function': function (setGroupPoll) {
            assert.isFunction(setGroupPoll);
        },
        '| a watchGroup instace with setGroupPoll applied after start': {
            topic: function () {
                vows = this;
                watchGroup.on('new-stat', function () {
                    watchGroup.on('new-stat', vows.callback);
                });
                watchGroup.start();
            },
            'should have .stat': function () {
                assert.isObject(watchGroup.stat);
            },
            'should have .stat.mem': function () {
                assert.isTrue(watchGroup.stat.total_mem > 0);
            },
            'should have .stat.pmem': function () {
                assert.isTrue(watchGroup.stat.total_pmem > 0);
            },
            'should have .stat.pcpu': function () {
                assert.isTrue(watchGroup.stat.total_pcpu >= 0);
            },
            'should have .stat.ipcpu': function () {
                assert.isTrue(watchGroup.stat.total_ipcpu >= 0);
            },
            '| call `.stop()` on watchGroup instance': {
                topic: function () {
                    watchGroup.on('non-running', this.callback);
                    watchGroup.stop();
                },
                'should be stoped': function () {
                    assert.strictEqual(watchGroup.running, 0);
                }
            }
        }
    }
}).export(module);
