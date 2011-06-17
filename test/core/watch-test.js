(function() {
  var Curator, assert, vows, watch, watchWithOptions, watchWithUse;
  vows = require('vows');
  assert = require('assert');
  Curator = require('curator');
  watch = Curator.newWatch(function() {
    this.name = 'test-watch';
    return this.startCommand = 'node';
  });
  watchWithOptions = Curator.newWatch(function() {
    var key, value, _ref;
    this.name = 'test-with-options';
    this.startCommand = 'node -e process.env.curator';
    this.startOptions = {
      env: {
        curator: 'success'
      }
    };
    _ref = process.env;
    for (key in _ref) {
      value = _ref[key];
      this.startOptions.env[key] = value;
    }
    return this.on('data', function(data) {
      if (/success/.test(data.toString())) {
        return this.optionsSuccess = true;
      }
    });
  });
  watchWithUse = Curator.newWatch().use(function() {
    return this.useTest = true;
  });
  vows.describe('core/watch.js').addBatch({
    'A watch instance': {
      topic: watch,
      'is a object': function() {
        return assert.isObject(watch);
      },
      'is an instance of Curator.Watch': function() {
        return assert.isTrue(watch instanceof Curator.Watch);
      },
      'responds to start': function() {
        return assert.isFunction(watch.start);
      },
      'responds to stop': function() {
        return assert.isFunction(watch.stop);
      },
      'responds to use': function() {
        return assert.isFunction(watch.use);
      },
      'has a null pid': function() {
        return assert.isNull(watch.pid);
      },
      'is not running': function() {
        return assert.isFalse(watch.running);
      },
      '| call `.use()` with two functions': {
        topic: function() {
          return watch.use(function() {
            return this.useCalled = true;
          }, [
            function(a, b, c) {
              return this.arrayFunctionCalling = a + b + c;
            }, 1, 2, 3
          ]);
        },
        'functions should be called': function() {
          assert.isTrue(watch.useCalled);
          return assert.equal(watch.arrayFunctionCalling, 6);
        }
      },
      '| after `.start()` on started event': {
        topic: function() {
          watch.on('started', this.callback);
          watch.start();
        },
        'has a pid': function() {
          return assert.ok(watch.pid);
        },
        'has a writable stdin stream': function() {
          return assert.isTrue(watch.stdin.writable);
        },
        'has readable stdout, stderr streams': function() {
          assert.isTrue(watch.stdout.readable);
          return assert.isTrue(watch.stderr.readable);
        },
        '| after .stop() on exit event': {
          topic: function() {
            watch.on('exit', this.callback);
            watch.stop();
          },
          'is not running': function() {
            return assert.isFalse(watch.running);
          },
          'has a null pid': function() {
            return assert.isNull(watch.pid);
          },
          'has no readable or writable streams': function() {
            assert.isFalse(watch.stdin.writable);
            assert.isFalse(watch.stdout.readable);
            return assert.isFalse(watch.stderr.readable);
          }
        }
      }
    },
    'A watch object created with miminalist config func, after call use with a function': {
      topic: function() {
        return watchWithUse;
      },
      'should return itself and the function should be called': function() {
        return assert.isTrue(watchWithUse.useTest);
      }
    },
    'A watch object started with custom options': {
      topic: function() {
        watchWithOptions.on('exit', this.callback);
        watchWithOptions.start();
      },
      'should have custom options applied': function() {
        return assert.isTrue(watchWithOptions.optionsSuccess);
      }
    }
  })["export"](module);
}).call(this);
