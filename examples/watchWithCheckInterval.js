var Curator = require('curator');

Curator.newWatch(function () {
  this.name = 'node';
  this.startCommand = 'node -e a=[];setInterval(function(){a.push(require("../../lib/index"))},0);';
  // This process will eat up some memory
  this.checkInterval = 500; // Poll stats every 500ms.
  Curator.setPoll(this); // Apple setPoll behavior on this instance.
  this.on('err', Curator.print); // Print process' STDERR
  this.on('new-stat', function () { // Execute everytime when there's new stats.
    console.log(this.stat.mem + ' kiB');
    if (this.stat.mem > 13776) this.stop()
  });
});

Curator.startAll();
