sys = require 'sys'
child_process = require 'child_process'
{EventEmitter} = require 'events'

helpers = require 'curator/lib/helpers'

# Watch object
# Not exported because this shouldn't be called directly.
class Watch extends EventEmitter
  constructor: (func) ->
    func.call @

  start: ->
    return false if @running

    @emit 'start'

    @child = helpers.exec @startCommand, (err, stdout, stderr) =>
      @emit 'finish', err, stdout, stderr

    @stdin = @child.stdin
    @stdout = @child.stdout
    @stderr = @child.stderr

    @stdout.on 'data', (data) => @emit 'data', data

    @stderr.on 'data', (data) => @emit 'err', data

    @emit 'started'

    @child.on 'exit', (code, signal) => @emit 'exit', code, signal

    # Return the watch object itself.
    @

  stop: -> @child.kill()

Watch::__defineGetter__ 'pid', ->
  if typeof @child is 'undefined'
    null
  else
    @child.pid

Watch::__defineGetter__ 'running', -> @pid?

# This function creates a new watch instance, then push it to the watchList.
exports.newWatch = (func) ->
  newWatch = new Watch func
  @watchList.push newWatch
  newWatch
