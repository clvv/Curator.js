child_process = require 'child_process'

# Helpers, eliminate unnecessary anonymous functions.
module.exports = exports.helpers = helpers =
  starter: (watch = @) ->
    try
      watch.start()
    catch err
      false

  stopper: (watch = @) ->
    try
      watch.stop()
    catch err
      false

  startAll: -> @watchList.forEach helpers.starter
  stopAll: -> @watchList.forEach helpers.stopper
  print: (data) -> console.log data.toString()

  filter: (filterFunc, func) ->
    @watchList.forEach (watch) ->
      func watch if filterFunc watch

  # This is the exec that will be called to spawn any child process.
  exec: (command, options) ->
    args = command.split ' '
    command = args.shift()
    child_process.spawn command, args, options

  # This is the use helper function for Watch and WatchGroup.
  use: ->
    # Apply each functions passed in.
    for each in arguments
      (each?.call? @) or each[0]?.apply? @, each[1...]
    # Return the instance itself.
    @
