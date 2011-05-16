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
      'responds to use': ->
        assert.isFunction watch.use
      'has a null pid': ->
        assert.isNull watch.pid
      'is not running': ->
        assert.isFalse watch.running
      '| call `.use()` with two functions':
        topic: ->
          watch.use ->
            @useCalled = true
          , [ (a, b, c) ->
            @arrayFunctionCalling = a + b + c
          , 1, 2, 3]
        '| functions should be called': ->
          assert.isTrue watch.useCalled
          assert.equal watch.arrayFunctionCalling, 6
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
    'A watch object created with miminalist config func, after call use with a function':
      topic: ->
        watch2 = Curator.newWatch()
        watch2.use ->
          @useTest = true
      'should return itself and the function should be called': (watch2) ->
        assert.isTrue watch2.useTest
  .export module
