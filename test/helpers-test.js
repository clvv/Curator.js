(function() {
  var assert, helpers, vows;
  vows = require('vows');
  assert = require('assert');
  helpers = require('curator/lib/helpers');
  vows.describe('helpers').addBatch({
    'The helpers object': {
      topic: helpers,
      'has a starter function': function() {
        return assert.isFunction(helpers.starter);
      },
      'has a stopper function': function() {
        return assert.isFunction(helpers.stopper);
      },
      'has a print function': function() {
        return assert.isFunction(helpers.print);
      },
      'has a exec funtion': function() {
        return assert.isFunction(helpers.exec);
      }
    },
    'The starter function': {
      topic: function() {
        var testObject;
        vows = this;
        testObject = {
          start: function() {
            return vows.callback(true);
          }
        };
        return helpers.starter(testObject);
      },
      'calls start on the first argument or the object bound to it': function(value) {
        return assert.isTrue(value);
      }
    },
    'The stopper function': {
      topic: function() {
        var testObject;
        vows = this;
        testObject = {
          stop: function() {
            return vows.callback(true);
          }
        };
        return helpers.stopper(testObject);
      },
      'calls stop on the first argument or the object bound to it': function(value) {
        return assert.isTrue(value);
      }
    }
  })["export"](module);
}).call(this);
