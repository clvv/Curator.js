var child_process = require('child_process');

// Helpers, eliminate unnecessary anonymous functions
module.exports = exports.helpers = {
    starter : function (watch) {
        if (! watch)
            watch = this;
        try {
            watch.start();
        } catch (err) {
            return false;
        }
    },
    stopper : function (watch) {
        if (! watch)
            watch = this;
        try {
            watch.stop();
        } catch (err) {
            return false;
        }
    },
    startAll : function () {
        this.watchList.forEach(helpers.starter);
    },
    stopAll : function () {
        this.watchList.forEach(helpers.stopper);
    },
    print : function (data) {
        console.log(data.toString());
    },
    filter : function (filterFunc, func) {
        this.watchList.forEach(function (watch) {
            if (filterFunc(watch))
                func(watch);
        });
    },
    // This is the exec that will be called to spawn any child process.
    exec : function (command, options, callback) {
        if (!arguments[2])
            callback = arguments[1];
        if (/\|/.test(command)) {
            if (!arguments[2])
                return child_process.exec(command, callback);
            else
                return child_process.exec(command, options, callback);
        } else {
            args = command.split(' ');
            command = args.shift();
            return child_process.spawn(command, args);
        }
    }
};
