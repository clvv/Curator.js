(function() {
  module.exports = function(watchGroup) {
    if (watchGroup == null) {
      watchGroup = this;
    }
    return watchGroup.on('new-stat', function() {
      watchGroup.spareProcesses = 0;
      watchGroup.watchList.forEach(function(watch) {
        if (watch.stat.ipcpu > 3) {
          return watchGroup.spareProcesses++;
        }
      });
      return watchGroup.emit('check');
    });
  };
}).call(this);
