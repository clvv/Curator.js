(function() {
  var Curator, assert, vows;

  vows = require('vows');

  assert = require('assert');

  Curator = require('curator');

  vows.describe('Curator').addBatch({
    'The Curator object': {
      topic: Curator,
      'responds to newWatch': function() {
        return assert.isFunction(Curator.newWatch);
      },
      'responds to newWatchGroup': function() {
        return assert.isFunction(Curator.newWatchGroup);
      },
      'responds to startAll': function() {
        return assert.isFunction(Curator.startAll);
      },
      'responds to stopAll': function() {
        return assert.isFunction(Curator.stopAll);
      }
    }
  })["export"](module);

}).call(this);
