sys = require 'sys'
child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'

# Watch object
# Not exported because this shouldn't be called directly.
class Watch extends EventEmitter
  constructor: ->
    @use.apply @, arguments

  start: ->
    # Return if it is already running.
    return @ if @running

    @emit 'start'

    @child = helpers.exec @startCommand, @startOptions

    # Setup hooks
    @stdin = @child.stdin
    @stdout = @child.stdout
    @stderr = @child.stderr
    @stdout.on 'data', (data) => @emit 'data', data
    @stderr.on 'data', (data) => @emit 'err', data
    @child.on 'exit', (code, signal) => @emit 'exit', code, signal

    @emit 'started'
    # Return the watch object itself.
    @

  stop: -> @child.kill()
  use: helpers.use

Watch::__defineGetter__ 'pid', ->
  if @child?.pid?
    @child.pid
  else
    null

Watch::__defineGetter__ 'running', -> @pid?

# This function creates a new watch instance, then push it to the watchList.
exports.newWatch = (func) ->
  newWatch = new Watch func
  @watchList.push newWatch
  newWatch
