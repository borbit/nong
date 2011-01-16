var ws = require('websocket-server');
var game = require('./game');
var Client = require('./client').Client;

exports.createServer = function() {
    var server = ws.createServer();
    server.addListener('connection', function(connection) {
        var client = new Client(connection);
        game.join(client);
        /*
        conn.addListener('message', function(message) {
            console.log('Got message: ' + message);
            conn.send(message);
            conn.close();
        });
        
        conn.addListener('close', function(conn) {
            console.log('Disconnected.');
        });
        
        conn.send('Hello!');
        */
    });
    return server;
}
