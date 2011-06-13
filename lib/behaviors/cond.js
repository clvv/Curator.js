(function() {
  var Timeline;
  Timeline = (function() {
    function Timeline(times) {
      this.max = times[0];
      this.size = times[1];
      this.times = 0;
      this.records = [];
    }
    Timeline.prototype.push = function(value) {
      if (value) {
        this.times++;
      }
      this.records.push(value);
      if (this.records.length > this.size) {
        if (this.records.shift()) {
          this.times--;
        }
      }
      if (this.times >= this.max) {
        return true;
      } else {
        return false;
      }
    };
    Timeline.prototype.length = function() {
      return this.records.length;
    };
    Timeline.prototype.reset = function() {
      this.times = 0;
      return this.records = [];
    };
    return Timeline;
  })();
  module.exports = module.exports = function(checkFunc, times, execFunc) {
    var timeline, _ref;
        if ((_ref = this.timelines) != null) {
      _ref;
    } else {
      this.timelines = [];
    };
    timeline = new Timeline(times);
    this.timelines.push(timeline);
    this.on('new-stat', function() {
      if (checkFunc.call(this)) {
        if (timeline.push(true)) {
          return execFunc.call(this);
        }
      } else {
        return timeline.push(false);
      }
    });
    return this.on('exit', function() {
      return timeline.reset();
    });
  };
}).call(this);
