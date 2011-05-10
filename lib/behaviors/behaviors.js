(function() {
  module.exports = {
    autoRestart: require('curator/lib/behaviors/autoRestart'),
    setInterval: require('curator/lib/behaviors/setInterval'),
    setPoll: require('curator/lib/behaviors/setPoll'),
    setGroupPoll: require('curator/lib/behaviors/setGroupPoll'),
    dynamicControl: require('curator/lib/behaviors/dynamicControl')
  };
}).call(this);
