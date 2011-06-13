vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'

autoRestart = require 'curator/lib/behaviors/autoRestart'

watch = Curator.newWatch ->
  @name = 'test-autorestart'
  @startCommand = 'date'
  @maxRetry = 3
  autoRestart @

vows
  .describe('behaviors/autoRstart')
  .addBatch
    'A watch instance with `maxRetry` set to 3 and `autoRstart(this)` applied after start':
      topic: ->
        watch.once 'max-retry-reached', @callback
        watch.start()
        return
      'has count of 3': ->
        assert.equal watch.count, 3
      '| restart the instance and run the test again':
        topic: ->
          watch.emit 'reset'
          watch.once 'max-retry-reached', @callback
          watch.start()
          return
        'has count of 3': ->
          assert.equal watch.count, 3
  .export module
