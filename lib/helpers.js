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
    exec: function(command, options) {
      var args;
      args = command.split(' ');
      command = args.shift();
      return child_process.spawn(command, args, options);
    },
    use: function() {
      var each, _i, _len, _ref;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        each = arguments[_i];
        (each != null ? typeof each.call === "function" ? each.call(this) : void 0 : void 0) || ((_ref = each[0]) != null ? typeof _ref.apply === "function" ? _ref.apply(this, each.slice(1)) : void 0 : void 0);
      }
      return this;
    }
  };
}).call(this);
