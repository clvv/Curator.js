(function() {
  var exitHandler, exitHandlerSimple, initHandler;

  initHandler = function() {
    return this.count = 0;
  };

  exitHandler = function(code, signal) {
    var _this = this;
    this.count++;
    return process.nextTick(function() {
      if (_this.count >= _this.maxRetry) {
        return _this.emit('max-retry-reached');
      } else {
        return _this.start();
      }
    });
  };

  exitHandlerSimple = function(code, signal) {
    var _this = this;
    return process.nextTick(function() {
      return _this.start();
    });
  };

  module.exports = function(watch) {
    if (watch == null) watch = this;
    watch.reset = initHandler;
    if (watch.maxRetry > 0) {
      watch.once('started', initHandler);
      watch.on('reset', initHandler);
      return watch.on('exit', exitHandler);
    } else {
      return watch.on('exit', exitHandlerSimple);
    }
  };

}).call(this);
