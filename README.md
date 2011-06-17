Curator.js
==========

Curator.js is a flexible process monitoring and management framework written in
coffeescript and run on top of node.js.

Curator provides interfaces to control and monitor processes and process groups.
Each process is tied to an object called a "watch instance." Curator also
provides a watchGroup object that represent a group of processes, which can be
dynamically configured.

Features
--------

* Designed to be extensible and flexible.
* Asyc-style process management.
* Access processes' stdin, stdout, and stderr streams. No need to implement IPC.
* Custom conditions with timeline.

Install
-------

You can install Curator.js using npm.

    npm install curator

Examples
--------

Here is a simpliest task in Curator, creating a auto-restart job.

```coffeescript
Curator = require 'curator'

myWatch = Curator.newWatch ->
  @name = 'my-watch-instance'
  @startCommand = 'some-command' # Change this as you like.
  @on 'data', Curator.print # Print process' STDOUT.
  @use Curator.autoRestart # Apply autoRestart module to this instance.

myWatch.start()
```

Of course, you can also set `@maxRetry` if you like.

For more examples please see examples/*

Messing with the Code
---------------------
The structure of the Curator project consists of three main parts: core, system,
and modules. Core is the small set of code that implements watch and watchGroup.
System is the part where Curator interacts with system level API like doing
procfs lookups. Modules are parts that extend and define the behaviors of watch
and watchGroup instances. You can easily extend Curator by writing custom
modules.

Curator is written in coffee-script. All source code is located under `src`
directory. After you make some change in `src`, you can rebuild all javascript
files with `cake build`. Make sure you run `vows` to test out your change.

Todo
----

* More elaborate API documentations.
* Implement logging and better error handling.
* Implement instance states: starting, running etc.
* Make module helpers like do-once-per-lifecycle, do-on-starting etc.
* Implement Apache MPM like dynamic control.

License
-------
Curator.js is licensed under "MIT/X11" License, see LICENSE file.
