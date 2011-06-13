# Timeline class.
class Timeline
  constructor: (times) ->
    @max = times[0]
    @size = times[1]
    @records = []

  push: (value) ->
    @records.push value
    @records.shift() if @records.length > @size
    if value
      sum = 0
      for entry in @records
        sum++ if entry
      return true if sum >= @max
    false

module.exports = module.exports = (checkFunc, times, execFunc) ->
  @timelines ?= []

  timeline = new Timeline times
  @timelines.push timeline

  newStatHandler = ->
    if checkFunc.call @
      if timeline.push true
        execFunc.call @
    else
      timeline.push false

  @on 'new-stat', newStatHandler

  @once 'exit', ->
    @timelines = []
    @removeListener 'new-stat', newStatHandler

