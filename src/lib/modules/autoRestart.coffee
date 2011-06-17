initHandler = ->
  @count = 0

exitHandler = (code, signal) ->
  @count++
  # We want all the exit listeners to be processed first.
  process.nextTick =>
    if @count >= @maxRetry
      @emit 'max-retry-reached'
    else
      @start()

exitHandlerSimple = (code, signal) ->
  # We want all the exit listeners to be processed first.
  process.nextTick => @start()

module.exports = (watch = @) ->
  watch.reset = initHandler
  if watch.maxRetry > 0
    watch.once 'started', initHandler
    watch.on 'reset', initHandler
    watch.on 'exit', exitHandler
  else
    watch.on 'exit', exitHandlerSimple
