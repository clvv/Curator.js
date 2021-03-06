(function() {
  var EventEmitter, Watch, child_process, helpers;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  child_process = require('child_process');

  EventEmitter = require('events').EventEmitter;

  helpers = require('curator/lib/helpers');

  exports.Watch = Watch = (function() {

    __extends(Watch, EventEmitter);

    function Watch() {
      this.use.apply(this, arguments);
    }

    Watch.prototype.start = function() {
      var prop, _i, _len, _ref;
      if (this.running) return this;
      this.emit('start');
      try {
        this.child = helpers.exec(this.startCommand, this.startOptions);
      } catch (err) {
        console.log("Failed to spawn " + this.startCommand + " with " + this.startOptions);
      }
      _ref = ['stdin', 'stdout', 'stderr'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        this[prop] = this.child[prop];
      }
      this.hook(this.stdout, 'data');
      this.hook(this.stderr, 'data', 'err');
      this.hook(this.child, 'exit');
      this.emit('started');
      return this;
    };

    Watch.prototype.stop = function() {
      return this.child.kill();
    };

    Watch.prototype.use = helpers.use;

    Watch.prototype.cond = require('curator/lib/modules/cond');

    Watch.prototype.doEmit = function(event) {
      var _this = this;
      return function() {
        return _this.emit.apply(_this, [event].concat(__slice.call(arguments)));
      };
    };

    Watch.prototype.hook = function(emitter, event, emitEvent) {
      if (emitEvent == null) emitEvent = event;
      return emitter.on(event, this.doEmit(emitEvent));
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
