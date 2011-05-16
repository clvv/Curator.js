helpers = require 'curator/lib/helpers'

module.exports =
  helpers       : helpers
  newWatch      : require('curator/lib/core/watch').newWatch
  newWatchGroup : require('curator/lib/core/watchGroup').newWatchGroup
  watchList     : [] # Array of watch instances
  startAll      : helpers.startAll
  stopAll       : helpers.stopAll
  filter        : helpers.filter
