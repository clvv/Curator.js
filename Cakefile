{print} = require 'sys'
{spawn, exec} = require 'child_process'

task 'build', 'Build scriptbroadcast', ->
    options = ['-c', '-o', './', 'src']
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', (data) -> print data.toString()
    coffee.stderr.on 'data', (data) -> print data.toString()
