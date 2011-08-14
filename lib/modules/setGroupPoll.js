(function() {
  var initialStat, poller, setInterval;
  poller = require('curator/lib/system/poller');
  setInterval = require('curator/lib/modules/setInterval');
  initialStat = {
    total_mem: 0,
    total_pmem: 0,
    total_pcpu: 0,
    total_ipcpu: 0,
    count: 0
  };
  module.exports = function(watchGroup) {
    var newStatHandler;
    if (watchGroup == null) {
      watchGroup = this;
    }
    watchGroup.stat = initialStat;
    newStatHandler = function() {
      watchGroup.stat.count++;
      if (watchGroup.stat.count >= watchGroup.watchList.length) {
        watchGroup.stat.total_mem = 0;
        watchGroup.stat.total_pmem = 0;
        watchGroup.stat.total_pcpu = 0;
        watchGroup.stat.total_ipcpu = 0;
        watchGroup.watchList.forEach(function(watch) {
          watchGroup.stat.total_mem += watch.stat.mem;
          watchGroup.stat.total_pmem += watch.stat.pmem;
          watchGroup.stat.total_pcpu += watch.stat.pcpu;
          return watchGroup.stat.total_ipcpu += watch.stat.ipcpu;
        });
        watchGroup.stat.count = 0;
        return watchGroup.emit('new-stat');
      }
    };
    watchGroup.on('load', function(watch) {
      watch.checkInterval = watchGroup.checkInterval;
      return watch.on('new-stat', newStatHandler);
    });
    return setInterval(watchGroup, (function() {
      return watchGroup.watchList.forEach(poller.poll);
    }), watchGroup.checkInterval);
  };
}).call(this);
