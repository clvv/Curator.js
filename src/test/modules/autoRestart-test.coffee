vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'

autoRestart = require 'curator/lib/modules/autoRestart'

watch = Curator.newWatch ->
  @name = 'test-autorestart'
  @startCommand = 'date'
  @maxRetry = 3
  autoRestart @

watch2 = Curator.newWatch()
watch2.name = 'autorestart=test2'
watch2.startCommand = 'date'
watch2.exitTimes = 0
autoRestart watch2
# Of course we are not gonna test that this will restart itself forever.
watch2.on 'exit', ->
  if @exitTimes++ > 5
    @removeAllListeners 'exit'
    @emit 'reached', true

vows
  .describe('modules/autoRstart')
  .addBatch
    'A watch instance with `maxRetry` set to 3 and `autoRstart` applied after start':
      topic: ->
        watch.once 'max-retry-reached', @callback
        watch.start()
        return
      'has count of 3': ->
        assert.equal watch.count, 3
      '| restart the instance and run the test again':
        topic: ->
          watch.reset()
          watch.once 'max-retry-reached', @callback
          watch.start()
          return
        'has count of 3': ->
          assert.equal watch.count, 3
    'A watch instance with `autoRestart` applied after start':
      topic: ->
        watch2.once 'reached', @callback
        watch2.start()
        return
      'should restart as many times as possible': (val) ->
        assert.isTrue val
  .export module
