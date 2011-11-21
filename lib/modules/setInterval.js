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
    var _ref, _ref2;
    if (watch == null) watch = this;
    if (watch.startGrace) if (startGrace == null) startGrace = watch.startGrace;
    if ((_ref = watch.intervals) == null) watch.intervals = [];
    if ((_ref2 = watch.startGraceTimeouts) == null) watch.startGraceTimeouts = [];
    if (startGrace) {
      watch.on('started', function() {
        return watch.startGraceTimeouts.push(setTimeout((function() {
          return watch.intervals.push(setInterval(func.bind(watch), interval));
        }), startGrace));
      });
    } else {
      watch.on('started', function() {
        return watch.intervals.push(setInterval(func.bind(watch), interval));
      });
    }
    if (watch.hasRemoveListenerFunc !== true) {
      watch.hasRemoveListenerFunc = true;
      watch.clearTimeouts = clearTimeouts;
      watch.clearIntervals = clearIntervals;
      return watch.on('exit', exitHandler);
    }
  };

}).call(this);
