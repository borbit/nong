var fs = require('fs');
var ws_server = require('./ws-server');

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
    console.log(err.stack);
    process.exit(1);
});

// gracefully exit on SIGINT and SIGTERM
function stop() {
    process.exit();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

// creating websocket server
var server = ws_server.createServer();

// listening for websocket connections
server.listen(config.WS_PORT);
console.log('Websocket server listening on port ' + config.WS_PORT);
