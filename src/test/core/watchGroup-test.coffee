vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'
watchGroup = Curator.newWatchGroup ->
  @name = 'test-group'
  @startProcesses = 2
  @startCommand = 'node'

vows
  .describe('core/watchGroup.js')
  .addBatch
    'A watchGroup instance':
      topic: null
      'is an object': ->
        assert.isObject watchGroup
      'is an instance of Curator.WatchGroup': ->
        assert.isTrue watchGroup instanceof Curator.WatchGroup
      'responds to start': ->
        assert.isFunction watchGroup.start
      'responds to stop': ->
        assert.isFunction watchGroup.stop
      'responds to create': ->
        assert.isFunction watchGroup.create
      'responds to spawn': ->
        assert.isFunction watchGroup.spawn
      'has a list of watch instances': ->
        assert.isArray(watchGroup.watchList)
      '| after `.start()` on all-running event':
        topic: ->
          watchGroup.once 'all-running', @callback
          watchGroup.start()
          return
        'has two watch instances in watchList': ->
          assert.equal watchGroup.watchList.length, 2
        'has all processes running': ->
          watchGroup.watchList.forEach (watch) ->
            assert.isTrue watch.running
        '| after `.create(2)` and `.start()` on all-running event':
          topic: ->
            watchGroup.once 'all-running', @callback
            watchGroup.create 2
            watchGroup.start()
            return
          'has two more watch instances': ->
            assert.equal watchGroup.watchList.length, 4
          '| after `.spawn(2)` on all-running event':
            topic: ->
              watchGroup.once 'all-running', @callback
              watchGroup.spawn 2
            'has two more watch instances': ->
              assert.equal watchGroup.watchList.length, 6
            '| after `.stop()` and on non-running event':
              topic: ->
                watchGroup.on 'non-running', @callback
                watchGroup.stop()
                return
              'has no running children': ->
                watchGroup.watchList.forEach (watch) ->
                  assert.isFalse watch.running
              'has running process count zero': ->
                assert.equal watchGroup.running, 0
  .export module
