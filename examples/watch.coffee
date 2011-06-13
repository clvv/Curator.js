Curator = require 'curator'

Curator.newWatch ->
  @name = 'date'
  @startCommand = 'date'
  @on 'data', Curator.print # Print process' STDOUT
  @maxRetry = 3; # Only restart three times
  Curator.autoRestart @ # Apply autoRestart behavior to this instance

Curator.startAll() # Start all watch instances
