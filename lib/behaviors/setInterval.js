module.exports = function (watch, func, interval, startGrace) {
    if ( ( ! startGrace ) && watch.startGrace ) startGrace = watch.startGrace
    if (typeof watch.intervals === 'undefined')  { watch.intervals = [] }
    if (typeof watch.startGraceTimeout === 'undefined') { watch.startGraceTimeout = [] }

    // Setup the check interval after the process starts.
    watch.on('started', function () {
        if (startGrace) {
            watch.startGraceTimeout.push ( setTimeout( function () {
                watch.intervals.push( setInterval(func.bind(watch), interval) );
            }, startGrace) );
        } else {
            watch.intervals.push( setInterval(func.bind(watch), interval) );
        }
    });

    // Add the clear-interval-and-timeout listener once.
    if ( watch.hasRemoveListenerFunc == true ) {
        return;
    } else {
        watch.hasRemoveListenerFunc = true;
    }
    watch.on('exit', function (code, signal) {
        watch.startGraceTimeout.forEach(function (id) {
            clearTimeout(id);
        });
        watch.intervals.forEach(function (id) {
            clearInterval(id);
        });
    });
};
