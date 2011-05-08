var clearTimeouts = function () {
  this.startGraceTimeouts.forEach(function (id) {
    clearTimeout(id);
  });
};
var clearIntervals = function () {
  this.intervals.forEach(function (id) {
    clearInterval(id);
  });
};
var exitHandler = function (code, signal) {
  this.clearTimeouts();
  this.clearIntervals();
};

module.exports = function (watch, func, interval, startGrace) {
  if ( ( ! startGrace ) && watch.startGrace )
    startGrace = watch.startGrace;
  if (typeof watch.intervals === 'undefined')
    watch.intervals = [];
  if (typeof watch.startGraceTimeouts === 'undefined')
    watch.startGraceTimeouts = [];

  // Setup the check interval after the process starts.
  watch.on('started', function () {
    if (startGrace) {
      watch.startGraceTimeouts.push ( setTimeout( function () {
        watch.intervals.push( setInterval(func.bind(watch), interval) );
      }, startGrace) );
    } else
      watch.intervals.push( setInterval(func.bind(watch), interval) );
  });

  // Add the clear-interval-and-timeout listener once.
  if ( watch.hasRemoveListenerFunc !== true ) {
    watch.hasRemoveListenerFunc = true;

    watch.clearTimeouts = clearTimeouts;
    watch.clearIntervals = clearIntervals;

    watch.on('exit', exitHandler);
  }
};
