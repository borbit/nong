// adding `node_modules` to require.paths
var path = require('path');
var root = path.normalize(__dirname + '/..');
require.paths.unshift(root + '/node_modules');

var fs = require('fs');
var ws = require('websocket-server');

var config = require('../config/config.js');

// checking if pidfile exists
try {
    fs.statSync(config.PIDFILE);
    console.log('Looks like pong server is already running.');
    console.log('If you\'re sure it isn\'t, remove ' + config.PIDFILE);
    return;
} catch (e) {
    // creating it if it 
    fs.writeFileSync(config.PIDFILE, process.pid.toString());
}

// removing pidfile on exit
process.on('exit', function() {
    console.log('Shutting down server...');
    console.log('Removing pidfile ' + config.PIDFILE);
    fs.unlinkSync(config.PIDFILE);
});

// gracefully exit on uncaught exception
process.on('uncaughtException', function(err) {
    console.log('Uncaught exception: ' + err);
    process.exit(1);
});

// gracefully exit on SIGINT and SIGTERM
function stop() {
    process.exit();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

// creating websocket server
var server = ws.createServer();
server.addListener('connection', function(conn) {
    console.log('New connection!');
    
    conn.addListener('message', function(message) {
        console.log('Got message: ' + message);
    });
});

server.addListener('close', function(conn) {
    console.log('Disconnected.');
});

// listening for websocket connections
server.listen(config.WS_PORT);
console.log('Websocket server listening on port ' + config.WS_PORT);
