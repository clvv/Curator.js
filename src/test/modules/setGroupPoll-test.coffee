vows = require 'vows'
assert = require 'assert'

setGroupPoll = require 'curator/lib/modules/setGroupPoll'

Curator = require 'curator'
watchGroup = Curator.newWatchGroup ->
  @name = 'test-setGroupPoll'
  @startCommand = 'node'
  @startProcesses = 2
  @checkInterval = 80
  setGroupPoll @

vows
  .describe('modules/setGroupPoll')
  .addBatch
    'setGroupPoll function':
      topic: ->
        setGroupPoll
      'is a function': (setGroupPoll) ->
        assert.isFunction setGroupPoll
      '| a watchGroup instace with setGroupPoll applied after start':
        topic: ->
          vows = @
          watchGroup.once 'new-stat', ->
            watchGroup.once 'new-stat', vows.callback
          watchGroup.start()
          return
        'should have .stat': ->
          assert.isObject watchGroup.stat
        'should have .stat.mem': ->
          assert.isTrue watchGroup.stat.total_mem > 0
        'should have .stat.pmem': ->
          assert.isTrue watchGroup.stat.total_pmem > 0
        'should have .stat.pcpu': ->
          assert.isTrue watchGroup.stat.total_pcpu >= 0
        'should have .stat.ipcpu': ->
          assert.isTrue watchGroup.stat.total_ipcpu >= 0
        '| call `.stop()` on watchGroup instance':
          topic: ->
            watchGroup.on 'non-running', @callback
            watchGroup.stop()
            return
          'should be stoped': ->
            assert.strictEqual watchGroup.running, 0
          '| restart the instance and run the test again': ->
            topic: ->
              vows = @
              watchGroup.stat = null
              watchGroup.once 'new-stat', ->
                watchGroup.once 'new-stat', vows.callback
              watchGroup.start()
              return
            'should have .stat': ->
              assert.isObject watchGroup.stat
            'should have .stat.mem': ->
              assert.isTrue watchGroup.stat.total_mem > 0
            'should have .stat.pmem': ->
              assert.isTrue watchGroup.stat.total_pmem > 0
            'should have .stat.pcpu': ->
              assert.isTrue watchGroup.stat.total_pcpu >= 0
            'should have .stat.ipcpu': ->
              assert.isTrue watchGroup.stat.total_ipcpu >= 0
  .export module
