module.exports = (watchGroup = @) ->
  watchGroup.on 'new-stat', ->
    watchGroup.spareProcesses = 0
    for watch in WatchGroup.watchList
      watchGroup.spareProcesses++ if watch.stat?.ipcpu? < 1

    m = watchGroup.spareProcesses - watchGroup.maxSpareProcesses
    n = watchGroup.minSpareProcesses - watchGroup.spareProcesses
    watchGroup.kill m if m > 0
    watchGroup.spawn n if n > 0

    watchGroup.emit 'mem-exceed' if watchGroup.total_mem > watchGroup.maxMemory
    watchGroup.emit 'cpu-exceed' if watchGroup.total_icpu > watchGroup.maxCpu

    watchGroup.emit('check')
