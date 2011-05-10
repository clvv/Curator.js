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
    function Watch(func) {
      func.call(this);
    }
    Watch.prototype.start = function() {
      if (this.running) {
        return false;
      }
      this.emit('start');
      this.child = helpers.exec(this.startCommand, __bind(function(err, stdout, stderr) {
        return this.emit('finish', err, stdout, stderr);
      }, this));
      this.stdin = this.child.stdin;
      this.stdout = this.child.stdout;
      this.stderr = this.child.stderr;
      this.stdout.on('data', __bind(function(data) {
        return this.emit('data', data);
      }, this));
      this.stderr.on('data', __bind(function(data) {
        return this.emit('err', data);
      }, this));
      this.emit('started');
      this.child.on('exit', __bind(function(code, signal) {
        return this.emit('exit', code, signal);
      }, this));
      return this;
    };
    Watch.prototype.stop = function() {
      return this.child.kill();
    };
    return Watch;
  })();
  Watch.prototype.__defineGetter__('pid', function() {
    if (typeof this.child === 'undefined') {
      return null;
    } else {
      return this.child.pid;
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
