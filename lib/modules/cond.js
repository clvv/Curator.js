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
        this.records.push(true);
      } else {
        this.records.push(false);
      }
      if (this.records.length > this.size && this.records.shift()) {
        this.times--;
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
  module.exports = function(checkFunc, times, execFunc) {
    var timeline, _ref;
    if ((_ref = this.timelines) == null) {
      this.timelines = [];
    }
    timeline = new Timeline(times);
    this.timelines.push(timeline);
    this.on('new-stat', function() {
      if (timeline.push(checkFunc.call(this))) {
        return execFunc.call(this);
      }
    });
    return this.on('exit', function() {
      return timeline.reset();
    });
  };
}).call(this);
