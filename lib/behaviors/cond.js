(function() {
  var Timeline;
  Timeline = (function() {
    function Timeline(times) {
      this.max = times[0];
      this.size = times[1];
      this.records = [];
    }
    Timeline.prototype.push = function(value) {
      var entry, sum, _i, _len, _ref;
      this.records.push(value);
      if (this.records.length > this.size) {
        this.records.shift();
      }
      if (value) {
        sum = 0;
        _ref = this.records;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          if (entry) {
            sum++;
          }
        }
        if (sum >= this.max) {
          return true;
        }
      }
      return false;
    };
    return Timeline;
  })();
  module.exports = module.exports = function(checkFunc, times, execFunc) {
    var newStatHandler, timeline, _ref;
        if ((_ref = this.timelines) != null) {
      _ref;
    } else {
      this.timelines = [];
    };
    timeline = new Timeline(times);
    this.timelines.push(timeline);
    newStatHandler = function() {
      if (checkFunc.call(this)) {
        if (timeline.push(true)) {
          return execFunc.call(this);
        }
      } else {
        return timeline.push(false);
      }
    };
    this.on('new-stat', newStatHandler);
    return this.once('exit', function() {
      this.timelines = [];
      return this.removeListener('new-stat', newStatHandler);
    });
  };
}).call(this);
