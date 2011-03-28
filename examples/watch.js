var Curator = require('curator');

Curator.newWatch(function () {
    this.name = 'date';
    this.startCommand = 'date';
    this.on('data', Curator.print); // Print process' STDOUT
    this.maxRetry = 3; // Only restart three times
    Curator.autoRestart(this); // Apply autoRestart behavior to this instance
});

Curator.startAll();
