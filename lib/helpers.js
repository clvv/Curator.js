(function() {
  var child_process, helpers;
  child_process = require('child_process');
  module.exports = exports.helpers = helpers = {
    starter: function(watch) {
      if (watch == null) {
        watch = this;
      }
      try {
        return watch.start();
      } catch (err) {
        return false;
      }
    },
    stopper: function(watch) {
      if (watch == null) {
        watch = this;
      }
      try {
        return watch.stop();
      } catch (err) {
        return false;
      }
    },
    startAll: function() {
      return this.watchList.forEach(helpers.starter);
    },
    stopAll: function() {
      return this.watchList.forEach(helpers.stopper);
    },
    print: function(data) {
      return console.log(data.toString());
    },
    filter: function(filterFunc, func) {
      return this.watchList.forEach(function(watch) {
        if (filterFunc(watch)) {
          return func(watch);
        }
      });
    },
    exec: function(command, options, callback) {
      var args;
      if (!arguments[2]) {
        callback = arguments[1];
      }
      if (/\|/.test(command)) {
        if (!callback) {
          return child_process.exec(command, callback);
        } else {
          return child_process.exec(command, options, callback);
        }
      } else {
        args = command.split(' ');
        command = args.shift();
        return child_process.spawn(command, args);
      }
    }
  };
}).call(this);
