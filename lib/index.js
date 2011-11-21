(function() {
  var exports;

  exports = module.exports = require('curator/lib/core/core');

  exports.modules = require('curator/lib/modules/modules');

  exports.print = exports.helpers.print;

  exports.autoRestart = exports.modules.autoRestart;

  exports.setInterval = exports.modules.setInterval;

  exports.setPoll = exports.modules.setPoll;

  exports.setGroupPoll = exports.modules.setGroupPoll;

  exports.poll = require('curator/lib/system/poller').poll;

}).call(this);
