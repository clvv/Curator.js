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
    function WatchGroup(func) {
      var self;
      self = this;
      this.watchList = [];
      this.running = 0;
      func.call(this);
      this.startHandler = function() {
        return self.emit('each-start', this);
      };
      this.startedHandler = function() {
        self.emit('each-started', this);
        self.running++;
        if (self.running === self.watchList.length) {
          return self.emit('all-running');
        }
      };
      this.dataHandler = function(data) {
        return self.emit('data', data, this);
      };
      this.exitHandler = function(code, signal) {
        self.emit('each-exit', code, signal, this);
        self.running--;
        if (self.running === 0) {
          return self.emit('non-running');
        }
      };
      this.create(this.startProcesses);
      this;
    }
    WatchGroup.prototype.create = function(n) {
      var created, i, initializeWatch, self;
      self = this;
      created = [];
      initializeWatch = function() {
        this.name = self.name;
        this.startCommand = self.startCommand;
        this.on('start', self.startHandler);
        this.on('started', self.startedHandler);
        this.on('data', self.dataHandler);
        this.on('exit', self.exitHandler);
        return self.emit('load', this);
      };
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        created.push(newWatch.call(this, initializeWatch));
      }
      return created;
    };
    WatchGroup.prototype.spawn = function(n) {
      return this.create(n).forEach(helpers.starter);
    };
    WatchGroup.prototype.start = helpers.startAll;
    WatchGroup.prototype.stop = helpers.stopAll;
    WatchGroup.prototype.filter = helpers.filter;
    return WatchGroup;
  })();
  exports.newWatchGroup = function(func) {
    var newWatchGroup;
    newWatchGroup = new WatchGroup(func);
    this.watchList.push(newWatchGroup);
    return newWatchGroup;
  };
}).call(this);
