module.exports = function (watch, func, interval, startGrace) {
    if ( ( ! startGrace ) && watch.startGrace ) startGrace = watch.startGrace
    if (typeof watch.intervals === 'undefined')  { watch.intervals = [] }
    if (typeof watch.startGraceTimeouts === 'undefined') { watch.startGraceTimeouts = [] }

    // Setup the check interval after the process starts.
    watch.on('started', function () {
        if (startGrace) {
            watch.startGraceTimeouts.push ( setTimeout( function () {
                watch.intervals.push( setInterval(func.bind(watch), interval) );
            }, startGrace) );
        } else {
            watch.intervals.push( setInterval(func.bind(watch), interval) );
        }
    });

    // Add the clear-interval-and-timeout listener once.
    if ( watch.hasRemoveListenerFunc ) {
        return;
    } else {
        watch.hasRemoveListenerFunc = true;

        watch.clearTimeouts = function () {
            this.startGraceTimeouts.forEach(function (id) {
                clearTimeout(id);
            });
        }
        watch.clearIntervals = function () {
            this.intervals.forEach(function (id) {
                clearInterval(id);
            });
        }
        watch.on('exit', function (code, signal) {
            watch.clearTimeouts();
            watch.clearIntervals();
        });
    }
};
