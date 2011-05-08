var setInterval = require('curator/lib/behaviors/setInterval');
var poller = require('curator/lib/system/poller');

// This is just a really simple wrapper around poller
// We have this wrapper so that setGroupPoll can also use the same poller
module.exports = function (watch) {
  setInterval(watch, poller.poll, watch.checkInterval);
}
