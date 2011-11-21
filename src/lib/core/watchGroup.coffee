child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'
{newWatch} = require 'curator/lib/core/watch'

# WatchGroup object
exports.WatchGroup = class WatchGroup extends EventEmitter
  constructor: ->
    @watchList = []
    @running = 0
    # Apply custom configurations.
    @use arguments...
    # Initialize set parent function for the WatchGroup object
    @initializeParent = @initializeParentWith @
    # Create startProcesses number of initial watch instances.
    @create @startProcesses

  # This function creates an array of n watch instances.
  create: (n) ->
    (newWatch.call @, @initializeParent, @initializeWatch for i in [1..n])

  spawn: (n) -> @create(n).forEach helpers.starter
  start: ->
    @emit 'start'
    helpers.startAll.call @
    @emit 'started'
  stop: ->
    @emit 'exit'
    helpers.stopAll.call @
  filter: helpers.filter
  use: helpers.use
  cond: require 'curator/lib/modules/cond'

  # Handlers
  handlers:
    start: -> @parent.emit 'each-start', @

    started: ->
      @parent.emit 'each-started', @
      @parent.running++
      @parent.emit 'all-running' if @parent.running is @parent.watchList.length

    data: (data) -> @parent.emit 'data', data, @

    exit: (code, signal) ->
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
    for event in ['start', 'started', 'data', 'exit']
      @on event, @parent.handlers[event]
    @parent.emit 'load', @

# This function creates a new watchGroup instance, then push it to the watchList.
exports.newWatchGroup = ->
  newWatchGroup = new WatchGroup arguments...
  @watchList.push newWatchGroup
  newWatchGroup
