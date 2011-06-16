(function() {
  module.exports = {
    autoRestart: require('curator/lib/modules/autoRestart'),
    setInterval: require('curator/lib/modules/setInterval'),
    setPoll: require('curator/lib/modules/setPoll'),
    setGroupPoll: require('curator/lib/modules/setGroupPoll'),
    dynamicControl: require('curator/lib/modules/dynamicControl')
  };
}).call(this);
