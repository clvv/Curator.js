// This is the procfs poller.

var child_process = require('child_process');
var fs = require('fs');

var os = require('os');

var kb_per_page = 4;
var hertz = 100;

// Memory usage in KiB
var mem = function (stat) {
    return stat.rss * kb_per_page
};

// pmem and pcpu algorithms are from god-rb
var pmem = function (stat) {
    return stat.mem * 1024 / os.totalmem() * 100;
};

var pcpu = function (stat) {
    var total_time = stat.utime + stat.stime;
    var seconds = stat.timestamp - stat.starttime / hertz;
    return (total_time * 1000 / hertz) / seconds / 10;
};

// Interval pcpu, CPU utilization within some interval
var ipcpu = exports.ipcpu = function (old_utime, old_stime, interval, stat) {
    var total_time = stat.utime + stat.stime - old_utime - old_stime;
    var seconds = interval / 1000;
    return (total_time * 1000 / hertz) / seconds / 10;
};

exports.poll = function(pid, callback) {
    fs.readFile('/proc/' + pid + '/stat', function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }

        data = data.toString('utf8').split(' ');

        stat = {
            pid: parseInt(data[0]), comm: data[1], state: data[2],
            ppid: parseInt(data[3]), pgrp: parseInt(data[4]), session:
            parseInt(data[5]), tty_nr: parseInt(data[6]), tpgid:
            parseInt(data[7]), flags: parseInt(data[8]), minflt:
            parseInt(data[9]), cminflt: parseInt(data[10]), majflt:
            parseInt(data[11]), cmajflt: parseInt(data[12]), utime:
            parseInt(data[13]), stime: parseInt(data[14]), cutime:
            parseInt(data[15]), cstime: parseInt(data[16]), priority:
            parseInt(data[17]), nice: parseInt(data[18]), num_threads:
            parseInt(data[19]), itrealvalue: parseInt(data[20]),
            starttime: parseInt(data[21]), vsize: parseInt(data[22]),
            rss: parseInt(data[23]), rsslim: parseInt(data[24]),
            startcode: parseInt(data[25]), endcode: parseInt(data[26]),
            startstack: parseInt(data[27]), kstkesp: parseInt(data[28]),
            kstkeip: parseInt(data[29]), signal: parseInt(data[30]),
            blocked: parseInt(data[31]), sigignore: parseInt(data[32]),
            sigcatch: parseInt(data[33]), wchan: parseInt(data[34]),
            nswap: parseInt(data[35]), cnswap: parseInt(data[36]),
            exit_signal: parseInt(data[37]), processor:
            parseInt(data[38]), rt_priority: parseInt(data[39]),
            policy: parseInt(data[40]), delayacct_blkio_ticks:
            parseInt(data[41]), guest_time: parseInt(data[42]),
            cguest_time: parseInt(data[43].trim())
        };

        stat.timestamp = os.uptime();

        stat.mem = mem(stat);
        stat.pmem = pmem(stat);
        stat.pcpu = pcpu(stat);

        callback(null, stat);
    });
};
