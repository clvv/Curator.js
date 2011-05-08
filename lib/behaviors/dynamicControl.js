module.exports = function (watchGroup) {
  watchGroup.on('new-stat', function () {
    watchGroup.spareProcesses = 0;
    watchGroup.watchList.forEach(function (watch) {
      if (watch.stat.ipcpu > 3)
        watchGroup.spareProcesses++;
    });

    //m = watchGroup.spareProcesses - watchGroup.maxSpareProcesses;
    //n = watchGroup.minSpareProcesses - watchGroup.spareProcesses;
    //if (m > 0) {
    //watchGroup.kill(m);
    //}
    //else if (n > 0) {
    //watchGroup.spawn(n);
    //}

    //if (watchGroup.total_mem > watchGroup.maxMemory) {
    //kill();
    //}

    //if (watchGroup.total_icpu > watchGroup.maxCpu) {
    //kill();
    //}

    watchGroup.emit('check');
  });
};
