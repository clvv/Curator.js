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
  exec: (command, options, callback) ->
    callback = arguments[1] unless arguments[2]
    if /\|/.test command
      unless callback
        child_process.exec command, callback
      else
        child_process.exec command, options, callback
    else
      args = command.split ' '
      command = args.shift()
      child_process.spawn command, args
