(function() {
  var EventEmitter, Watch, child_process, helpers, sys;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  sys = require('sys');
  child_process = require('child_process');
  EventEmitter = require('events').EventEmitter;
  helpers = require('curator/lib/helpers');
  Watch = (function() {
    __extends(Watch, EventEmitter);
    function Watch(func) {
      this.use = __bind(this.use, this);      if (func != null) {
        if (typeof func.call === "function") {
          func.call(this);
        }
      }
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
    Watch.prototype.use = function() {
      var arg, each, _i, _len;
      arg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = arg.length; _i < _len; _i++) {
        each = arg[_i];
        if (each != null) {
          if (typeof each.call === "function") {
            each.call(this);
          }
        }
        if (each instanceof Array) {
          each[0].apply(this, each.slice(1));
        }
      }
      return this;
    };
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
  exports.newWatch = function(func) {
    var newWatch;
    newWatch = new Watch(func);
    this.watchList.push(newWatch);
    return newWatch;
  };
}).call(this);
