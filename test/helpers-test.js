var vows = require('vows');
var assert = require('assert');

var helpers = require('curator/lib/helpers');

vows.describe('helpers').addBatch({
  'The helpers object': {
    topic: helpers,
    'has a starter function': function () {
      assert.isFunction(helpers.starter);
    },
    'has a stopper function': function () {
      assert.isFunction(helpers.stopper);
    },
    'has a print function': function () {
      assert.isFunction(helpers.print);
    },
    'has a exec funtion': function () {
      assert.isFunction(helpers.exec);
    }
  },
  'The starter function': {
    topic: function () {
      vows = this;
      testObject = {
        start: function () {
          vows.callback(true);
        }
      };
      helpers.starter(testObject);
    },
    'calls start on the first argument or the object bound to it': function (value) {
      assert.isTrue(value);
    }
  },
  'The stopper function': {
    topic: function () {
      vows = this;
      testObject = {
        stop: function () {
          vows.callback(true);
        }
      };
      helpers.stopper(testObject);
    },
    'calls stop on the first argument or the object bound to it': function (value) {
      assert.isTrue(value);
    }
  },
  //'The exec function': {
  //topic: function () {

  //}
  //}
}).export(module);
