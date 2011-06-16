clearTimeouts = ->
  @startGraceTimeouts.forEach (id) ->
    clearTimeout id

clearIntervals = ->
  @intervals.forEach (id) ->
    clearInterval id

exitHandler = (code, signal) ->
  @clearTimeouts()
  @clearIntervals()

module.exports = (watch = @, func, interval, startGrace) ->
  startGrace ?= watch.startGrace if watch.startGrace
  watch.intervals ?= []
  watch.startGraceTimeouts ?= []

  # Setup the check interval after the process starts.
  watch.on 'started', ->
    if startGrace
      watch.startGraceTimeouts.push setTimeout (->
        watch.intervals.push setInterval (func.bind watch), interval), startGrace
    else
      watch.intervals.push setInterval (func.bind watch), interval

  # Add the clear-interval-and-timeout listener once.
  if watch.hasRemoveListenerFunc isnt true
    watch.hasRemoveListenerFunc = true

    watch.clearTimeouts = clearTimeouts
    watch.clearIntervals = clearIntervals

    watch.on 'exit', exitHandler
