(function() {
  var EventEmitter, WatchGroup, child_process, helpers, newWatch, sys;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  sys = require('sys');
  child_process = require('child_process');
  EventEmitter = require('events').EventEmitter;
  helpers = require('curator/lib/helpers');
  newWatch = require('curator/lib/core/watch').newWatch;
  WatchGroup = (function() {
    __extends(WatchGroup, EventEmitter);
    function WatchGroup() {
      this.watchList = [];
      this.running = 0;
      this.use.apply(this, arguments);
      this.create(this.startProcesses);
    }
    WatchGroup.prototype.create = function(n) {
      var i, _results;
      _results = [];
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        _results.push(newWatch.call(this, this.initializeParentWith(this), this.initializeWatch));
      }
      return _results;
    };
    WatchGroup.prototype.spawn = function(n) {
      return this.create(n).forEach(helpers.starter);
    };
    WatchGroup.prototype.start = helpers.startAll;
    WatchGroup.prototype.stop = helpers.stopAll;
    WatchGroup.prototype.filter = helpers.filter;
    WatchGroup.prototype.use = helpers.use;
    WatchGroup.prototype.startHandler = function() {
      return this.parent.emit('each-start', this);
    };
    WatchGroup.prototype.startedHandler = function() {
      this.parent.emit('each-started', this);
      this.parent.running++;
      if (this.parent.running === this.parent.watchList.length) {
        return this.parent.emit('all-running');
      }
    };
    WatchGroup.prototype.dataHandler = function(data) {
      return this.parent.emit('data', data, this);
    };
    WatchGroup.prototype.exitHandler = function(code, signal) {
      this.parent.emit('each-exit', code, signal, this);
      this.parent.running--;
      if (this.parent.running === 0) {
        return this.parent.emit('non-running');
      }
    };
    WatchGroup.prototype.initializeParentWith = function(parent) {
      return function() {
        return this.parent = parent;
      };
    };
    WatchGroup.prototype.initializeWatch = function() {
      this.name = this.parent.name;
      this.startCommand = this.parent.startCommand;
      this.on('start', this.parent.startHandler);
      this.on('started', this.parent.startedHandler);
      this.on('data', this.parent.dataHandler);
      this.on('exit', this.parent.exitHandler);
      return this.parent.emit('load', this);
    };
    return WatchGroup;
  })();
  exports.newWatchGroup = function() {
    var newWatchGroup;
    newWatchGroup = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(WatchGroup, arguments, function() {});
    this.watchList.push(newWatchGroup);
    return newWatchGroup;
  };
}).call(this);
