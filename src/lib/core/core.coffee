helpers = exports.helpers = require 'curator/lib/helpers'

exports.newWatch = require('curator/lib/core/watch').newWatch
exports.newWatchGroup = require('curator/lib/core/watchGroup').newWatchGroup

exports.watchList = [] # Array of watch instances

exports.startAll = helpers.startAll
exports.stopAll = helpers.stopAll
exports.filter = helpers.filter