var vows = require('vows');
var assert = require('assert');

// Make our test instances global because object passing in vows is hell.
// Until another solution comes up, we assum here that instance creation won't
// fail.
var Curator = require('curator');

var dynamicControl = require('curator/lib/behaviors/dynamicControl');

var watchGroup = Curator.newWatchGroup(function () {
    this.name = 'dynamic-group';
    this.startCommand = 'node';
    this.startProcesses = 3;
    this.minProcesses = 2;
    this.maxProcesses = 4;
    this.minSpareProcesses = 1;
    this.maxSpareProcesses = 2;
    dynamicControl(this);
});

vows.describe('behaviors/dynamicControl').addBatch({
    'A watchGroup instance with `Curator.dynamicControl(this)` applied after start': {
        topic: function () {
            watchGroup.once('all-running', this.callback);
            watchGroup.start();
        },
        'will first fire up 3 watch instances': function () {
            assert.equal(watchGroup.watchList.length, 3);
        }
    }
}).export(module);
