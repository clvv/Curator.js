(function() {
  var Curator, assert, dynamicControl, vows, watchGroup;

  vows = require('vows');

  assert = require('assert');

  Curator = require('curator');

  dynamicControl = require('curator/lib/modules/dynamicControl');

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

  vows.describe('modules/dynamicControl').addBatch({
    'A watchGroup instance with `Curator.dynamicControl(this)` applied after start': {
      topic: function() {
        watchGroup.once('all-running', this.callback);
        watchGroup.start();
      },
      'will first fire up 3 watch instances': function() {
        assert.equal(watchGroup.watchList.length, 3);
        return watchGroup.stop();
      }
    }
  })["export"](module);

}).call(this);
