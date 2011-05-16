(function() {
  var helpers;
  helpers = require('curator/lib/helpers');
  module.exports = {
    helpers: helpers,
    newWatch: require('curator/lib/core/watch').newWatch,
    newWatchGroup: require('curator/lib/core/watchGroup').newWatchGroup,
    watchList: [],
    startAll: helpers.startAll,
    stopAll: helpers.stopAll,
    filter: helpers.filter
  };
}).call(this);
