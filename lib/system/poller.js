(function() {
  var procPoller;
  procPoller = require('curator/lib/system/procPoller');
  exports.ipcpu = procPoller.ipcpu;
  exports.poll = function(watch, callback) {
        if (watch != null) {
      watch;
    } else {
      watch = this;
    };
    if (!watch.pid) {
      return false;
    }
    return procPoller.poll(watch.pid, function(err, stat) {
      if (err) {
        return;
      }
      if (watch.hasOldStat) {
        stat.ipcpu = procPoller.ipcpu(watch.old_utime, watch.old_stime, watch.checkInterval, stat);
        if (!(stat.ipcpu >= 0)) {
          stat.ipcpu = 0;
        }
      } else {
        watch.hasOldStat = true;
        watch.on('exit', function() {
          return watch.hasOldStat = false;
        });
      }
      watch.old_utime = stat.utime;
      watch.old_stime = stat.stime;
      watch.stat = stat;
      if (callback != null) {
        if (typeof callback.call === "function") {
          callback.call(watch, watch.stat);
        }
      }
      return watch.emit('new-stat');
    });
  };
}).call(this);
