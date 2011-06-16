setInterval = require 'curator/lib/modules/setInterval'
poller = require 'curator/lib/system/poller'

# This is just a really simple wrapper around poller
# We have this wrapper so that setGroupPoll can also use the same poller
module.exports = (watch = @) ->
  setInterval watch, poller.poll, watch.checkInterval
