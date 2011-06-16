sys = require 'sys'
child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'

# Watch object
exports.Watch = class Watch extends EventEmitter
  constructor: ->
    @use.apply @, arguments

  start: ->
    # Return if it is already running.
    return @ if @running

    @emit 'start'

    @child = helpers.exec @startCommand, @startOptions

    # Setup hooks
    for prop in ['stdin', 'stdout', 'stderr']
      @[prop] = @child[prop]

    @hook @stdout, 'data'
    @hook @stderr, 'data', 'err'
    @hook @child, 'exit'

    @emit 'started'
    # Return the watch object itself.
    @

  stop: -> @child.kill()
  use: helpers.use
  cond: require 'curator/lib/modules/cond'

  # Function that returns a closure handling event "redirect"
  doEmit: (event) ->
    # Returns a function that "redirect" the event emited to the watch object.
    => @emit event, arguments...

  # Function that hook event from some event emitter to the watch instance.
  hook: (emitter, event, emitEvent = event) ->
    emitter.on event, @doEmit emitEvent

Watch::__defineGetter__ 'pid', ->
  if @child?.pid?
    @child.pid
  else
    null

Watch::__defineGetter__ 'running', -> @pid?

# This function creates a new watch instance, then push it to the watchList.
exports.newWatch = ->
  newWatch = new Watch arguments...
  @watchList.push newWatch
  newWatch
