const duckdb = require('duckdb');
const { emitDefaultLog } = require('./events/default-logs');

const db = new duckdb.Database('logs.duckdb', {
    "access_mode": "READ_WRITE",
    "max_memory": "1024MB",
    "threads": "4"
}, (err) => {
  if (err) {
    console.error(err);
    process.exit();
  }
});

const connection = db.connect();

/**
 * Create table default_logs if not exists
 */
const tableCreateQuery = `CREATE TABLE IF NOT EXISTS default_logs( id INTEGER PRIMARY KEY, type VARCHAR(255), log VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
connection.run(tableCreateQuery);
connection.run(`CREATE SEQUENCE default_logs_id START 1`);

class LOG {

    /**
     * 
     * @param {*} query 
     * @returns 
     */
    queryRunner(query) {
        return new Promise((resolve, reject) => {
            connection.all(query, function(err, res) {
                if (err) {
                    console.log(err);
                    reject(false)
                } else {
                    resolve(res);
                }
            });
        })
    }

    /**
     * 
     * @param {*} type 
     * @param {*} message 
     */
    async storeLog(type, message) {
        if (typeof message == 'object') message = JSON.stringify(message) 
        const stmt = connection.prepare(`INSERT INTO default_logs (id, type, log) VALUES (nextval('default_logs_id'), '${type}', '${message}')`);
        stmt.run();
        stmt.finalize();
        emitDefaultLog(JSON.stringify({type, log: message}));
    }

    /**
     * 
     * @param {*} type 
     * @param {*} cb 
     */
    count(type, cb) {
        connection.all(`SELECT COUNT(*) AS records_count FROM default_logs WHERE type='${type}'`, function(err, res) {
            if (err) {
                cb(false)
            }
            cb(res);
        });
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    info(message) {
        this.storeLog('info', message); return true;
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    error(message) {
        this.storeLog('error', message); return true;
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    debug(message) {
        this.storeLog('debug', message); return true;
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    fatal(message) {
        this.storeLog('fatal', message); return true;
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    warn(message) {
        this.storeLog('warn', message); return true;
    }

    /**
     * 
     * @param {*} type 
     * @param {*} cb 
     */
    list(type, cb) {
        connection.all(`SELECT * FROM default_logs WHERE type='${type}' ORDER BY log DESC`, function(err, res) {
            if (err) {
                cb(false)
            }
            cb(res);
        });
    }
    
}


const Log = new LOG();

module.exports = Log;