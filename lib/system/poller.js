// This file should determin which poller to use based on platform.
// Right now it only support polling procfs.

var procPoller = require('./procPoller');

exports.ipcpu = procPoller.ipcpu;

exports.poll = function (watch, callback) {
    if ( ! watch )
        watch = this;
    if ( ! watch.pid )
        return false;

    procPoller.poll(watch.pid, function (err, stat) {
        if (err)
            return;

        if (watch.hasOldStat) {
            stat.ipcpu = procPoller.ipcpu(watch.old_utime, watch.old_stime, watch.checkInterval, stat);
            if ( !(stat.ipcpu >= 0) )
                stat.ipcpu = 0;
        } else {
            watch.hasOldStat = true;
            watch.on('exit', function () {
                watch.hasOldStat = false;
            });
        }
        watch.old_utime = stat.utime;
        watch.old_stime = stat.stime;

        watch.stat = stat;

        if (callback)
            callback.call(watch, watch.stat);

        watch.emit('new-stat');
    });
};
