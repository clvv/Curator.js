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
      topic: null
      'is a function': ->
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
            watchGroup.once 'non-running', @callback
            watchGroup.stop()
            return
          'should be stoped': ->
            assert.strictEqual watchGroup.running, 0
          '| restart the instance and run the test again':
            topic: ->
              vows = @
              # Feed some false data that would otherwise fail the tests
              watchGroup.stat.total_mem = watchGroup.stat.total_pmem = 0
              watchGroup.stat.total_pcpu = watchGroup.stat.total_ipcpu = -1
              watchGroup.once 'new-stat', ->
                watchGroup.once 'new-stat', vows.callback
              watchGroup.start()
              return
            'should have correct stats again:': ->
              assert.isObject watchGroup.stat
              assert.isTrue watchGroup.stat.total_mem > 0
              assert.isTrue watchGroup.stat.total_pmem > 0
              assert.isTrue watchGroup.stat.total_pcpu >= 0
              assert.isTrue watchGroup.stat.total_ipcpu >= 0
            '| call `.stop()` on watchGroup instance again':
              topic: ->
                watchGroup.once 'non-running', @callback
                watchGroup.stop()
                return
              'should be stoped again': ->
                assert.strictEqual watchGroup.running, 0
  .export module
