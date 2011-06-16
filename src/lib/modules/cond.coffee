# Timeline class.
class Timeline
  # Times is a array that contains two numbers. For instance [3, 5] can be
  # interpreted as 3 out of 5 times. This resembles the same property in god-rb.
  constructor: (times) ->
    @max = times[0]
    @size = times[1]
    @times = 0
    @records = []

  push: (value) ->
    @times++ if value
    @records.push value
    if @records.length > @size
      if @records.shift()
        @times--
    if @times >= @max then true else false

  length: -> @records.length

  reset: ->
    @times = 0
    @records = []

# Cond is a function that do the following things:
# It runs checkFunc against the watch instance whenever there're new stats. If
# times[0] out of times[1] times checkFunc returns true, then it calls execFunc
# against the watch instance.
module.exports = module.exports = (checkFunc, times, execFunc) ->
  @timelines ?= []

  timeline = new Timeline times
  @timelines.push timeline

  @on 'new-stat', ->
    if checkFunc.call @
      if timeline.push true
        execFunc.call @
    else
      timeline.push false

  @on 'exit', ->
    timeline.reset()

