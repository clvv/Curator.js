vows = require 'vows'
assert = require 'assert'

setPoll = require 'curator/lib/behaviors/setPoll'
Curator = require 'curator'

watch = Curator.newWatch ->
  @name = 'test-setPoll'
  @startCommand = 'node'
  @checkInterval = 80
  setPoll @

vows
  .describe('behaviors/setPoll')
  .addBatch
    'setPoll function':
      topic: ->
        setPoll
      'is a function': (setPoll) ->
        assert.isFunction setPoll
      '| a watch instace with setPoll applied after start':
        topic: ->
          vows = this
          watch.once 'new-stat', ->
            watch.once 'new-stat', vows.callback
          watch.start()
          return
        'should have .stat': ->
          assert.isObject watch.stat
        'should have .stat.ipcpu': ->
          bool = watch.stat.ipcpu >= 0
          unless bool
            console.log ''
            console.log 'Fail stats:'
            console.log "watch.stat.ipcpu: #{watch.stat.ipcpu}"
          assert.isTrue bool
  .export module
