startedHandler = ->
  @count = 0

exitHandler = (code, signal) ->
  @count++
  if @count >= @maxRetry
    @emit 'max-retry-reached'
  else
    @start()

exitHandlerSimple = (code, signal) -> @start()

module.exports = (watch = @) ->
  if watch.maxRetry > 0
    watch.once 'started', startedHandler
    watch.on 'exit', exitHandler
  else
    watch.on 'exit'. exitHandlerSimple
