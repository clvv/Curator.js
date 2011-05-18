(function() {
  var EventEmitter, Watch, child_process, helpers, sys;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  sys = require('sys');
  child_process = require('child_process');
  EventEmitter = require('events').EventEmitter;
  helpers = require('curator/lib/helpers');
  Watch = (function() {
    __extends(Watch, EventEmitter);
    function Watch() {
      this.use.apply(this, arguments);
    }
    Watch.prototype.start = function() {
      if (this.running) {
        return this;
      }
      this.emit('start');
      this.child = helpers.exec(this.startCommand, this.startOptions);
      this.stdin = this.child.stdin;
      this.stdout = this.child.stdout;
      this.stderr = this.child.stderr;
      this.stdout.on('data', __bind(function(data) {
        return this.emit('data', data);
      }, this));
      this.stderr.on('data', __bind(function(data) {
        return this.emit('err', data);
      }, this));
      this.child.on('exit', __bind(function(code, signal) {
        return this.emit('exit', code, signal);
      }, this));
      this.emit('started');
      return this;
    };
    Watch.prototype.stop = function() {
      return this.child.kill();
    };
    Watch.prototype.use = helpers.use;
    return Watch;
  })();
  Watch.prototype.__defineGetter__('pid', function() {
    var _ref;
    if (((_ref = this.child) != null ? _ref.pid : void 0) != null) {
      return this.child.pid;
    } else {
      return null;
    }
  });
  Watch.prototype.__defineGetter__('running', function() {
    return this.pid != null;
  });
  exports.newWatch = function() {
    var newWatch;
    newWatch = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(Watch, arguments, function() {});
    this.watchList.push(newWatch);
    return newWatch;
  };
}).call(this);
