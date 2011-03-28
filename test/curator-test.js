var vows = require('vows');
var assert = require('assert');

var Curator = require('curator');

vows.describe('Curator').addBatch({
    'The Curator object': {
        topic: Curator,
        'responds to newWatch': function () {
            assert.isFunction(Curator.newWatch);
        },
        'responds to newWatchGroup': function () {
            assert.isFunction(Curator.newWatchGroup);
        },
        'responds to startAll': function () {
            assert.isFunction(Curator.startAll);
        },
        'responds to stopAll': function() {
            assert.isFunction(Curator.stopAll);
        },
    }
}).export(module);
