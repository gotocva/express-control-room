

const express = require('express');
const utils = require('./utils');
const { v4: uuidv4 } = require('uuid');

const { defaultLogStream } = require('./events/default-logs');
const Log = require('./logs');

const textColor = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

// Generate a v4 (random) UUID
const uuid = uuidv4();

const fs = require('fs');

fs.writeFile('token', uuid, (err) => {
  if (err) {
    console.log(textColor.red + 'Error creating token :' + textColor.reset, err);
  } else {
    console.log(textColor.green + '\nToken has been generated successfully! \n\n '+ uuid + textColor.reset);
  }
});

// Main function
const ControlRoom = (req, res, next) => {

    // Create a router for routes within the middleware
    const router = express.Router();

    // Define a route within the middleware
    router.get('/spark-node-metrics/utils', async (req, res) => {
        utils.process = await utils.getPidInformation(process.pid).catch(Log.error);
        res.status(200).json({status: true, message: 'System utils', data: utils});
    });

    // return token
    router.get('/spark-node-metrics/token', token);

    // SSE stream default logs on realtime
    router.get('/spark-node-metrics/logs/default/stream', defaultLogStream);

    // Use the router for the defined route
    router(req, res, next);
};


function token(req, res) {
    fs.readFile('token', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({status: false, message: 'unable to read token', data: err});
        } else {
            res.status(500).json({status: true, message: 'token', data: data});
        }
    });
}

module.exports = {
    ControlRoom,
    Log
}