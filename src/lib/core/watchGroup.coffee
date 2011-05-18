sys = require 'sys'
child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'
{newWatch} = require 'curator/lib/core/watch'

# WatchGroup object
# Not exported because this shouldn't be called directly.
class WatchGroup extends EventEmitter
  constructor: ->
    @watchList = []
    @running = 0
    # Apply custom configurations.
    @use.apply @, arguments
    # Initialize set parent function for the WatchGroup object
    @initializeParent = @initializeParentWith @
    # Create startProcesses number of initial watch instances.
    @create @startProcesses

  # This function creates an array of n watch instances.
  create: (n) ->
    (newWatch.call @, @initializeParent, @initializeWatch for i in [1..n])

  spawn: (n) -> @create(n).forEach helpers.starter
  start: helpers.startAll
  stop: helpers.stopAll
  filter: helpers.filter
  use: helpers.use

  # Handlers
  startHandler: -> @parent.emit 'each-start', @

  startedHandler: ->
    @parent.emit 'each-started', @
    @parent.running++
    @parent.emit 'all-running' if @parent.running is @parent.watchList.length

  dataHandler: (data) -> @parent.emit 'data', data, @

  exitHandler: (code, signal) ->
    @parent.emit 'each-exit', code, signal, @
    @parent.running--
    @parent.emit 'non-running' if @parent.running is 0

  # Function which returns a closure that sets each watch object's parent
  initializeParentWith: (parent) -> -> @parent = parent

  # Function that initialize each watch instance(the same single watch
  # instance) and add event hooks so that we have group wise events. The
  # instance that emitted the event will be appended to the list of arguments
  # to the group wise event.
  initializeWatch: ->
    @name = @parent.name
    @startCommand = @parent.startCommand
    @on 'start', @parent.startHandler
    @on 'started', @parent.startedHandler
    @on 'data', @parent.dataHandler
    @on 'exit', @parent.exitHandler
    @parent.emit 'load', @

# This function creates a new watchGroup instance, then push it to the watchList.
exports.newWatchGroup = ->
  newWatchGroup = new WatchGroup arguments...
  @watchList.push newWatchGroup
  newWatchGroup
