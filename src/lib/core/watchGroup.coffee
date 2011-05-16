sys = require 'sys'
child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'
newWatch = require('curator/lib/core/watch').newWatch

# WatchGroup object
# Not exported because this shouldn't be called directly.
class WatchGroup extends EventEmitter
  constructor: (func) ->
    self = @

    @watchList = []
    @running = 0
    # Apply custom configurations
    func.call @

    # Handlers for creating each watch instace.
    # We create this here because they are bind to each watchGroup.
    @startHandler = -> self.emit 'each-start', @

    @startedHandler = ->
      self.emit 'each-started', @
      self.running++
      self.emit 'all-running' if self.running is self.watchList.length

    @dataHandler = (data) -> self.emit 'data', data, @

    @exitHandler = (code, signal) ->
      self.emit 'each-exit', code, signal, @
      self.running--
      self.emit 'non-running' if self.running is 0

    @create @startProcesses

    # Return the WatchGroup object itself
    @

  # This function creates n watch instances and push them to the watchList.
  create: (n) ->
    self = @

    # Function that initialize each watch instance(the same single watch
    # instance) and add event hooks so that we have group wise events. The
    # instance that emitted the event will be appended to the list of arguments
    # to the group wise event.
    initializeWatch = ->
      @name = self.name
      @startCommand = self.startCommand
      @on 'start', self.startHandler
      @on 'started', self.startedHandler
      @on 'data', self.dataHandler
      @on 'exit', self.exitHandler
      self.emit 'load', @

    # Create an array of watch objects and return it.
    (newWatch.call @, initializeWatch for i in [1..n])

  spawn: (n) -> @create(n).forEach helpers.starter

  start: helpers.startAll

  stop: helpers.stopAll

  filter: helpers.filter

# This function creates a new watchGroup instance, then push it to the watchList.
exports.newWatchGroup = (func) ->
  newWatchGroup = new WatchGroup func
  @watchList.push newWatchGroup
  newWatchGroup
