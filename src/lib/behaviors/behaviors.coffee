# Behaviors:
# Behaviors are helpers that add specific characteristics to a watch instance
# by adding hooks to that instance. A basic example will be a forever behavior:
# forever = function (watch) {
#     watch.on('exit', function () {
#         watch.start();
#     });
# };

module.exports =
  autoRestart : require 'curator/lib/behaviors/autoRestart'
  setInterval : require 'curator/lib/behaviors/setInterval'
  setPoll: require 'curator/lib/behaviors/setPoll'
  setGroupPoll: require 'curator/lib/behaviors/setGroupPoll'
  dynamicControl : require 'curator/lib/behaviors/dynamicControl'
