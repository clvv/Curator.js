(function() {
  var exitHandler, exitHandlerSimple, initHandler;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  initHandler = function() {
    return this.count = 0;
  };
  exitHandler = function(code, signal) {
    this.count++;
    return process.nextTick(__bind(function() {
      if (this.count >= this.maxRetry) {
        return this.emit('max-retry-reached');
      } else {
        return this.start();
      }
    }, this));
  };
  exitHandlerSimple = function(code, signal) {
    return process.nextTick(__bind(function() {
      return this.start();
    }, this));
  };
  module.exports = function(watch) {
    if (watch == null) {
      watch = this;
    }
    if (watch.maxRetry > 0) {
      watch.once('started', initHandler);
      watch.on('reset', initHandler);
      return watch.on('exit', exitHandler);
    } else {
      return watch.on('exit', exitHandlerSimple);
    }
  };
}).call(this);
