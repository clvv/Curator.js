(function() {
  var poller, setInterval;
  setInterval = require('curator/lib/behaviors/setInterval');
  poller = require('curator/lib/system/poller');
  module.exports = function(watch) {
    return setInterval(watch, poller.poll, watch.checkInterval);
  };
}).call(this);
