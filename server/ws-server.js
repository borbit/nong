var ws = require('websocket-server');

exports.createServer = function() {
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
    return server;
}
