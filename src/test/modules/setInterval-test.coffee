vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'

setInterval = require 'curator/lib/modules/setInterval'

watch = Curator.newWatch ->
  @name = 'test-watch'
  @startCommand = 'node'
  @called = false
  setInterval @, ->
    if not @called
      @called = true
      @stop()
  , 0

watchWithStartGrace = Curator.newWatch ->
  @name = 'test-watch'
  @startCommand = 'node'
  @called = false
  @on 'started', Curator.helpers.stopper
  Curator.setInterval @, (watch) ->
    @called = true # This shouldn't be called
    @stop()
  , 0, 1000

vows
  .describe('modules/setInterval')
  .addBatch
    'A watch instance with `setInterval(this, callback, 0)` applied':
      topic: ->
        watch
      'has clearIntervals function': ->
        assert.isFunction watch.clearIntervals
      'has clearTimouts function': ->
        assert.isFunction watch.clearTimeouts
      '| after .start()':
        topic: ->
          watch.on('exit', @callback)
          watch.start()
          return
        'callback should be called': ->
          assert.isTrue watch.called
    'A watch instance with `setInterval(this, callback, 0, 1000)` applied after start':
      topic: ->
        watchWithStartGrace.on 'exit', @callback
        watchWithStartGrace.start()
      'callback shouldn\'t be called': ->
        assert.isFalse watchWithStartGrace.called
  .export module
