Curator.js
==========

Curator.js is a flexible process monitoring and management framework with node.js.

Features
--------

* Designed to be extensible and flexible.
* Access processes' stdin, stdout, and stderr streams. No need to implement IPC.
* Custom conditions with timeline.

Run `vows --spec` for more details.

Install
-------

You can install Curator.js using npm.

    npm install curator


Examples
--------

See examples/*

Messing with the Code
---------------------
Curator is written in coffee-script. All source code is located under `src`
directory. After you make some change in `src`, you can rebuild all javascript
files with `cake build`. Make sure you run `vows` to test out your change.

Todo
----

* More elaborate API documentations.
* Implement Apache MPM like dynamic control.

License
-------
Curator.js is licensed under "MIT/X11" License, see LICENSE file.
