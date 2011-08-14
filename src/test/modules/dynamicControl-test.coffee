vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'

dynamicControl = require 'curator/lib/modules/dynamicControl'

watchGroup = Curator.newWatchGroup ->
  @name = 'dynamic-group'
  @startCommand = 'node'
  @startProcesses = 3
  @minProcesses = 2
  @maxProcesses = 4
  @minSpareProcesses = 1
  @maxSpareProcesses = 2
  dynamicControl(this)

vows
  .describe('modules/dynamicControl')
  .addBatch
    'A watchGroup instance with `Curator.dynamicControl(this)` applied after start':
      topic: ->
        watchGroup.once 'all-running', @callback
        watchGroup.start()
        return
      'will first fire up 3 watch instances': ->
        assert.equal watchGroup.watchList.length, 3
        watchGroup.stop() # Stop the instance after done
  .export module
