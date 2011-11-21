(function() {
  var poller, setInterval;

  setInterval = require('curator/lib/modules/setInterval');

  poller = require('curator/lib/system/poller');

  module.exports = function(watch) {
    if (watch == null) watch = this;
    return setInterval(watch, poller.poll, watch.checkInterval);
  };

}).call(this);
