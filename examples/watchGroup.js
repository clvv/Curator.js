var Curator = require('curator');

Curator.newWatchGroup(function () {
    this.name = 'group';
    this.startProcesses = 3;
    this.startCommand = 'date';
    this.on('data', Curator.print);
    this.on('load', function (watch) { // Apply this to each instance on load
        watch.maxRetry = 3;
        Curator.autoRestart(watch);
    });
});

Curator.startAll();
