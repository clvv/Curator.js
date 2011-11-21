(function() {
  var helpers, watch, watchGroup;

  helpers = require('curator/lib/helpers');

  watch = require('curator/lib/core/watch');

  watchGroup = require('curator/lib/core/watchGroup');

  module.exports = {
    helpers: helpers,
    Watch: watch.Watch,
    WatchGroup: watchGroup.WatchGroup,
    newWatch: watch.newWatch,
    newWatchGroup: watchGroup.newWatchGroup,
    watchList: [],
    startAll: helpers.startAll,
    stopAll: helpers.stopAll,
    filter: helpers.filter
  };

}).call(this);
