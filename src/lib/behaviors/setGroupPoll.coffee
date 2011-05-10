poller = require 'curator/lib/system/poller'

initialStat =
  total_mem: 0
  total_pmem: 0
  total_pcpu: 0
  total_ipcpu: 0
  count: 0

module.exports = (watchGroup) ->

  watchGroup.stat = initialStat

  newStatHandler = ->
    watchGroup.stat.count++
    if watchGroup.stat.count >= watchGroup.watchList.length
      watchGroup.stat.total_mem = 0
      watchGroup.stat.total_pmem = 0
      watchGroup.stat.total_pcpu = 0
      watchGroup.stat.total_ipcpu = 0

      watchGroup.watchList.forEach (watch) ->
        watchGroup.stat.total_mem += watch.stat.mem
        watchGroup.stat.total_pmem += watch.stat.pmem
        watchGroup.stat.total_pcpu += watch.stat.pcpu
        watchGroup.stat.total_ipcpu += watch.stat.ipcpu

      watchGroup.stat.count = 0

      watchGroup.emit 'new-stat'

  watchGroup.on 'load', (watch) ->
    watch.checkInterval = watchGroup.checkInterval;
    watch.on 'new-stat', newStatHandler

  setInterval (->
    watchGroup.watchList.forEach poller.poll), watchGroup.checkInterval
