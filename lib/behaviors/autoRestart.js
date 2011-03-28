module.exports = function (watch) {
    if (watch.maxRetry > 0) {
        watch.once('started', function() {
            watch.count = 0;
        });
        watch.on('exit', function (code, signal) {
            watch.count++;
            if (watch.count >= watch.maxRetry){
                watch.emit('max-retry-reached');
            } else {
                watch.start();
            }
        });
    } else {
        watch.on('exit', function (code, signal) {
            watch.start();
        });
    }
};
