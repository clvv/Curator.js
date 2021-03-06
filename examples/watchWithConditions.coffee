Curator = require 'curator'

watch = Curator.newWatch ->
  @name = 'watch-with-conditions'
  @startCommand = 'node'
  @checkInterval = 500
  @cond (-> @stat.mem < 7000),
    [3, 5],
    Curator.helpers.stopper
  @on 'new-stat', ->
    console.log @stat.mem
    console.log @timelines[0].records

watch.use Curator.setPoll

Curator.startAll()
