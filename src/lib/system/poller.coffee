# This file should determin which poller to use based on platform.
# Right now it only support polling procfs.

procPoller = require 'curator/lib/system/procPoller'

exports.ipcpu = procPoller.ipcpu

exports.poll = (watch, callback) ->
  watch ?= @
  return false unless watch.pid

  procPoller.poll watch.pid, (err, stat) ->
    return if err

    if watch.hasOldStat
      stat.ipcpu = procPoller.ipcpu watch.old_utime,
        watch.old_stime, watch.checkInterval, stat
      stat.ipcpu = 0 unless stat.ipcpu >= 0
    else
      watch.hasOldStat = true
      watch.on 'exit', ->
        watch.hasOldStat = false

    watch.old_utime = stat.utime
    watch.old_stime = stat.stime

    watch.stat = stat

    callback?.call? watch, watch.stat

    watch.emit('new-stat')

