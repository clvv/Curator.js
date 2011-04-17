var startHandler = function() {
    this.count = 0;
};
var exitHandler = function (code, signal) {
    this.count++;
    if (this.count >= this.maxRetry){
        this.emit('max-retry-reached');
    } else
        this.start();
};
var exitHandlerSimple = function (code, signal) {
    this.start();
};

module.exports = function (watch) {
    if (watch.maxRetry > 0) {
        watch.once('started', startHandler);
        watch.on('exit', exitHandler);
    } else
        watch.on('exit', exitHandlerSimple);
};
