vows = require 'vows'
assert = require 'assert'

Curator = require 'curator'

watch = Curator.newWatch ->
  @name = 'test-setPoll'
  @startCommand = 'node'
  @checkInterval = 80
  Curator.setPoll @

vows
  .describe('modules/cond')
  .addBatch
    'cond function':
      topic: ->
        watch.cond
      'is a function': (cond) ->
        assert.isFunction cond
      '| a watch instace with a cond to callback applied after start':
        topic: ->
          watch.once 'cond-test', @callback
          watch.cond (-> true), [2,3], -> @emit 'cond-test', true
          watch.start()
          return
        'callback should be called': (val) ->
          assert.equal watch.timelines[0].length(), 2
          watch.stop()
        '| restart the watch instance and run the same test agagin':
          topic: ->
            vows = @
            watch.once 'exit', ->
              watch.once 'cond-test', vows.callback
              watch.start()
            return
          'callback should be called': (val) ->
            watch.stop()
            assert.isTrue val
  .export module
