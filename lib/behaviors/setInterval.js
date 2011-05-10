(function() {
  var clearIntervals, clearTimeouts, exitHandler;
  clearTimeouts = function() {
    return this.startGraceTimeouts.forEach(function(id) {
      return clearTimeout(id);
    });
  };
  clearIntervals = function() {
    return this.intervals.forEach(function(id) {
      return clearInterval(id);
    });
  };
  exitHandler = function(code, signal) {
    this.clearTimeouts();
    return this.clearIntervals();
  };
  module.exports = function(watch, func, interval, startGrace) {
    if (!startGrace && watch.startGrace) {
      startGrace = watch.startGrace;
    }
    if (typeof watch.intervals === 'undefined') {
      watch.intervals = [];
    }
    if (typeof watch.startGraceTimeouts === 'undefined') {
      watch.startGraceTimeouts = [];
    }
    watch.on('started', function() {
      if (startGrace) {
        return watch.startGraceTimeouts.push(setTimeout((function() {
          return watch.intervals.push(setInterval(func.bind(watch), interval));
        }), startGrace));
      } else {
        return watch.intervals.push(setInterval(func.bind(watch), interval));
      }
    });
    if (watch.hasRemoveListenerFunc !== true) {
      watch.hasRemoveListenerFunc = true;
      watch.clearTimeouts = clearTimeouts;
      watch.clearIntervals = clearIntervals;
      return watch.on('exit', exitHandler);
    }
  };
}).call(this);
