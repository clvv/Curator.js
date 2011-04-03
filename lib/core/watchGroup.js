var sys = require('sys');
var events = require('events');
var child_process = require('child_process');

var newWatch = require('curator/lib/core/watch').newWatch;
//var helpers = require('../helpers');

// watchGroup object
// Not exported because this shouldn't be called directly.
var watchGroup = function (func) {
    this.watchList = [];
    this.running = 0;
    func.call(this); // apply custom configurations
    this.create(this.startProcesses);
};

sys.inherits(watchGroup, events.EventEmitter);

// This function creates n watch instances and push them to the watchList.
watchGroup.prototype.create = function (n) {
    var self = this;

    created = [];

    for (i = 0; i < n; i++) {
        created.push( newWatch.call(this, function () {
            // Initialize each watch instance(the same single watch instance)
            // and add event hooks so that we have group wise events.
            // The instance that emitted the event will be appended to the list
            // of arguments to the group wise event.
            this.name = self.name;
            this.startCommand = self.startCommand;
            this.on('start', function () {
                self.emit('each-start', this);
            });
            this.on('started', function () {
                self.emit('each-started', this);
                self.running++;
                if (self.running === self.watchList.length) {
                    self.emit('all-running');
                }
            });
            this.on('data', function (data) {
                self.emit('data', data, this);
            });
            this.on('exit', function (code, signal) {
                self.emit('each-exit', code, signal, this);
                self.running--;
                if (self.running === 0) {
                    self.emit('non-running');
                }
            });
            self.emit('load', this);
        }) );
    }
    return created;
};

watchGroup.prototype.spawn = function (n) {
    this.create(n).forEach(helpers.starter);
};

watchGroup.prototype.start = helpers.startAll;
watchGroup.prototype.stop = helpers.stopAll;
watchGroup.prototype.filter = helpers.filter;

// This function creates a new watchGroup instance,
// then push it to the watchList.
exports.newWatchGroup = function (func) {
    id = this.watchList.push( new watchGroup(func) ) - 1;
    return this.watchList[id];
};
