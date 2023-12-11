

const pm2 = require('pm2');



const listProcess = (req, res) => {

    pm2.connect(function (err) {
        if (err) {
            return res.status(400).json({
                status: false, message: 'error', data: err
            })
        }

        pm2.list(function (err, processes) {
            if (err) {
                return res.status(400).json({
                    status: false, message: 'error', data: err
                })
            } else {
                res.status(200).json({
                    status: true, message: 'success', data: processes
                })
            }
            pm2.disconnect(); // Disconnect from PM2
        });
    });
}

module.exports = listProcess;