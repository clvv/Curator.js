vows = require 'vows'
assert = require 'assert'

Curator = require 'curator'

vows
  .describe('Curator')
  .addBatch
    'The Curator object':
      topic: Curator
      'responds to newWatch': ->
        assert.isFunction Curator.newWatch
      'responds to newWatchGroup': ->
        assert.isFunction Curator.newWatchGroup
      'responds to startAll': ->
        assert.isFunction Curator.startAll
      'responds to stopAll': ->
        assert.isFunction Curator.stopAll
  .export module
