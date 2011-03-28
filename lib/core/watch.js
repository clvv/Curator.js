var sys = require('sys');
var events = require('events');
var child_process = require('child_process');

//var helpers = require('../helpers.js');

// watch object
// Not exported because this shouldn't be called directly.
var watch = function (func) {

    func.call(this);

    this.__defineGetter__('pid', function () {
        if (typeof this.child === 'undefined') {
            return null;
        } else {
            return this.child.pid;
        }
    });

    this.__defineGetter__('running', function () {
        if (typeof this.pid !== 'undefined' && this.pid !== null) {
            return true;
        } else {
            return false;
        }
    });
};

sys.inherits(watch, events.EventEmitter);

watch.prototype.start = function () {
    if (this.running) return false;

    var self = this;

    this.emit('start');

    this.child = helpers.exec(this.startCommand, function (err, stdout, stderr) {
        self.emit('finish', err, stdout, stderr);
    });

    this.stdin = this.child.stdin;
    this.stdout = this.child.stdout;
    this.stderr = this.child.stderr;

    this.stdout.on('data', function (data) {
        self.emit('data', data);
    });

    this.stderr.on('data', function (data) {
        self.emit('err', data);
    });

    this.emit('started');

    this.child.on('exit', function (code, signal) {
        self.emit('exit', code, signal);
    });
};

// stop function for a single watch instance
watch.prototype.stop = function () {
    return this.child.kill();
};

// This function creates a new watch instance,
// then push it to the watchList.
exports.newWatch = function (func) {
    var id = this.watchList.push( new watch(func) ) - 1;
    return this.watchList[id];
};
