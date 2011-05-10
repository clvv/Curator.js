(function() {
  var exitHandler, exitHandlerSimple, startedHandler;
  startedHandler = function() {
    return this.count = 0;
  };
  exitHandler = function(code, signal) {
    this.count++;
    if (this.count >= this.maxRetry) {
      return this.emit('max-retry-reached');
    } else {
      return this.start();
    }
  };
  exitHandlerSimple = function(code, signal) {
    return this.start();
  };
  module.exports = function(watch) {
    if (watch.maxRetry > 0) {
      watch.once('started', startedHandler);
      return watch.on('exit', exitHandler);
    } else {
      return watch.on('exit'.exitHandlerSimple);
    }
  };
}).call(this);
