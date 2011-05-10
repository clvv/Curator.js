vows = require 'vows'
assert = require 'assert'

helpers = require 'curator/lib/helpers'

vows
  .describe('helpers')
  .addBatch
    'The helpers object':
      topic: helpers
      'has a starter function': ->
        assert.isFunction helpers.starter
      'has a stopper function': ->
        assert.isFunction helpers.stopper
      'has a print function': ->
        assert.isFunction helpers.print
      'has a exec funtion': ->
        assert.isFunction helpers.exec
    'The starter function':
      topic: ->
        vows = @
        testObject =
          start: ->
            vows.callback true
        helpers.starter testObject
      'calls start on the first argument or the object bound to it': (value) ->
        assert.isTrue value
    'The stopper function':
      topic: ->
        vows = @
        testObject =
          stop: ->
            vows.callback true
        helpers.stopper testObject
      'calls stop on the first argument or the object bound to it': (value) ->
        assert.isTrue value
  .export module
