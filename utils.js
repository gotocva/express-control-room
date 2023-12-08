const { exec } = require('child_process');
const os = require('os');
const v8 = require('v8');
const pidusage = require('pidusage');
const eventLoopStats = require('event-loop-stats');

// Get CPU information
const cpus = os.cpus();

const cpuCores = cpus.length || 1;

/**
 * get npm installed version
 */
function npmVersion() {
    return new Promise((resolve, reject) => {
        exec('npm -v', (error, stdout, stderr) => {
            if (error || stderr) {
              reject(false);
            }
            const npmVersion = stdout.trim();
            resolve(npmVersion);
        });
    });
}

/**
 * get npm installed version
 */
function nodeVersion() {
    return process.version;
}



// console.log('CPU Information:', cpus);

// Get memory information in MB
const totalMemory = os.totalmem() / 1024 / 1024;
const freeMemory = os.freemem() / 1024 / 1024;

// console.log(`Total Memory: ${totalMemory} bytes ${bytesToMB(totalMemory).toFixed(2)} MB`);
// console.log(`Free Memory: ${freeMemory} bytes ${bytesToMB(freeMemory).toFixed(2)} MB \n`);

/**
 * 
 * @param {*} pid 
 * @returns 
 */
function getPidInformation(pid) {
    return new Promise((resolve, reject) => {
        pidusage(pid, (err, stat) => {
            if (err) {
              reject(false);
            }
            // Convert from B to MB
            stat.memory = stat.memory / 1024 / 1024;
            stat.load = os.loadavg();
            stat.timestamp = Date.now();
            stat.heap = v8.getHeapStatistics();
        
            if (eventLoopStats) {
              stat.event_loop = eventLoopStats.sense();
              stat.event_loop_meta = {
                max: `Maximum number of milliseconds spent in a single loop since last sense call.`,
                min: `Minimum number of milliseconds spent in a single loop since last sense call.`,
                sum: `Total number of milliseconds spent in the loop since last sense call.`,
                num: `Total number of loops since last sense call.`
              }
            }
            resolve(stat);
        });
    })
}



module.exports = {
    cpus,
    cpuCores,
    npmVersion,
    nodeVersion,
    totalMemory,
    freeMemory,
    getPidInformation
}