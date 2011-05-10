(function() {
  var Curator, assert, dynamicControl, vows, watchGroup;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  dynamicControl = require('curator/lib/behaviors/dynamicControl');
  watchGroup = Curator.newWatchGroup(function() {
    this.name = 'dynamic-group';
    this.startCommand = 'node';
    this.startProcesses = 3;
    this.minProcesses = 2;
    this.maxProcesses = 4;
    this.minSpareProcesses = 1;
    this.maxSpareProcesses = 2;
    return dynamicControl(this);
  });
  vows.describe('behaviors/dynamicControl').addBatch({
    'A watchGroup instance with `Curator.dynamicControl(this)` applied after start': {
      topic: function() {
        watchGroup.once('all-running', this.callback);
        watchGroup.start();
      },
      'will first fire up 3 watch instances': function() {
        return assert.equal(watchGroup.watchList.length, 3);
      }
    }
  })["export"](module);
}).call(this);
