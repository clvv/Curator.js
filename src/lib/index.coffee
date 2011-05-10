exports = module.exports = require 'curator/lib/core/core'

exports.behaviors = require 'curator/lib/behaviors/behaviors'

# shortcut aliases
exports.print = exports.helpers.print
exports.autoRestart = exports.behaviors.autoRestart
exports.setInterval = exports.behaviors.setInterval
exports.setPoll = exports.behaviors.setPoll
exports.setGroupPoll = exports.behaviors.setGroupPoll

exports.poll = require('curator/lib/system/poller').poll
