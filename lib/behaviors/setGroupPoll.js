var poller = require('curator/lib/system/poller');

module.exports = function (watchGroup) {

    // Initialize group wise stats
    watchGroup.stat = {
        total_mem: 0,
        total_pmem: 0,
        total_pcpu: 0,
        total_ipcpu: 0,
        count: 0
    }

    // Add hooks to each watch instance in the group with 'load' event
    watchGroup.on('load', function (watch) {

        watch.checkInterval = watchGroup.checkInterval;

        watch.on('new-stat', function () {
            watchGroup.stat.count++;
            if (watchGroup.stat.count >= watchGroup.watchList.length) {
                watchGroup.stat.total_mem = 0;
                watchGroup.stat.total_pmem = 0;
                watchGroup.stat.total_pcpu = 0;
                watchGroup.stat.total_ipcpu = 0;

                watchGroup.watchList.forEach(function (watch) {
                    watchGroup.stat.total_mem += watch.stat.mem;
                    watchGroup.stat.total_pmem += watch.stat.pmem;
                    watchGroup.stat.total_pcpu += watch.stat.pcpu;
                    watchGroup.stat.total_ipcpu += watch.stat.ipcpu;
                });

                watchGroup.stat.count = 0;

                //console.log(require('util').inspect(watchGroup.stat));

                watchGroup.emit('new-stat');
            }
        });
    });

    // The poll interval
    setInterval(function () {
        watchGroup.watchList.forEach(function (watch) {
            poller.poll(watch);
        })
    }, watchGroup.checkInterval);
};
