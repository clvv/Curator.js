vows = require 'vows'
assert = require 'assert'

Curator = require 'curator'

watch = Curator.newWatch ->
  @name = 'test-setPoll'
  @startCommand = 'node'
  @checkInterval = 80
  Curator.setPoll @

vows
  .describe('behaviors/cond')
  .addBatch
    'cond function':
      topic: ->
        watch.cond
      'is a function': (cond) ->
        assert.isFunction cond
      '| a watch instace with a cond to callback applied after start':
        topic: ->
          vows = @
          watch.cond (-> true), [2,3], vows.callback
          watch.start()
          return
        'callback should be called': ->
          watch.stop()
          assert.isTrue true
  .export module
