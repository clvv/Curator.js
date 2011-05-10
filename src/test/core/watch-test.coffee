vows = require 'vows'
assert = require 'assert'

# Make our test instances global because object passing in vows is hell.
# Until another solution comes up, we assum here that instance creation won't
# fail.
Curator = require 'curator'
watch = Curator.newWatch ->
  @name = 'test-watch'
  @startCommand = 'node'

vows
  .describe('core/watch.js')
  .addBatch
    'A watch instance':
      topic: watch
      'is a object': ->
        assert.isObject watch
      'responds to start': ->
        assert.isFunction watch.start
      'responds to stop': ->
        assert.isFunction watch.stop
      'has a null pid': ->
        assert.isNull watch.pid
      'is not running': ->
        assert.isFalse watch.running
      '| after `.start()` on started event':
        topic: ->
          watch.on 'started', @callback
          watch.start()
          return
        'has a pid': ->
          assert.ok watch.pid
        'has a writable stdin stream': ->
          assert.isTrue watch.stdin.writable
        'has readable stdout, stderr streams': ->
          assert.isTrue watch.stdout.readable
          assert.isTrue watch.stderr.readable
        '| after .stop() on exit event':
          topic: ->
            watch.on 'exit', @callback
            watch.stop()
            return
          'is not running': ->
            assert.isFalse watch.running
          'has a null pid': ->
            assert.isNull watch.pid
          'has no readable or writable streams': ->
            assert.isFalse watch.stdin.writable
            assert.isFalse watch.stdout.readable
            assert.isFalse watch.stderr.readable
  .export module
