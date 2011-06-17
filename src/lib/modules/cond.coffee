# Timeline class.
class Timeline
  # Times is a array that contains two numbers. For instance [3, 5] can be
  # interpreted as 3 out of 5 times. This resembles the same property in god-rb.
  constructor: (times) ->
    @max = times[0]
    @size = times[1]
    @times = 0
    @records = []

  # Push can takes any value, but interpret it as its boolean equivalent.
  push: (value) ->
    if value
      @times++
      @records.push true
    else
      @records.push false

    @times-- if @records.length > @size and @records.shift()

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
    # Call checkFunc. Then call execFunc if the condition is met.
    execFunc.call @ if timeline.push checkFunc.call @

  @on 'exit', ->
    timeline.reset()

