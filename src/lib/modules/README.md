Modules
=======

Curator modules are helpers that add specific hooks to a watch or watchGroup
instance and thus alter its behaviors in certain ways. A basic example will be
a forever module:

```coffeescript
forever = (watch = @) ->
  watch.on 'exit', -> watch.start()
```

Ideally, a module should take either a instance(whether a watch or a watchGourp)
or no arguments at all and assuming that the function itself is bound to an
instance. This is easy to do in coffeescript: `(watch = @) ->`.
