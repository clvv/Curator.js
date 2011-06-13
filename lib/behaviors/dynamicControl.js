(function() {
  module.exports = function(watchGroup) {
    if (watchGroup == null) {
      watchGroup = this;
    }
    return watchGroup.on('new-stat', function() {
      var m, n, watch, _i, _len, _ref, _ref2;
      watchGroup.spareProcesses = 0;
      _ref = WatchGroup.watchList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watch = _ref[_i];
        if ((((_ref2 = watch.stat) != null ? _ref2.ipcpu : void 0) != null) < 1) {
          watchGroup.spareProcesses++;
        }
      }
      m = watchGroup.spareProcesses - watchGroup.maxSpareProcesses;
      n = watchGroup.minSpareProcesses - watchGroup.spareProcesses;
      if (m > 0) {
        watchGroup.kill(m);
      }
      if (n > 0) {
        watchGroup.spawn(n);
      }
      if (watchGroup.total_mem > watchGroup.maxMemory) {
        watchGroup.emit('mem-exceed');
      }
      if (watchGroup.total_icpu > watchGroup.maxCpu) {
        watchGroup.emit('cpu-exceed');
      }
      return watchGroup.emit('check');
    });
  };
}).call(this);
