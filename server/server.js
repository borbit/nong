var ws = require('websocket-server');
var Client = require('./client');
var Handlers = require('./handlers');
var NongGame = require('./nongGame');

exports.createServer = function() {
    var game = NongGame.createGame();
    var handlers = Handlers.createHandlers(game);
    var server = ws.createServer();
    
    server.addListener('connection', function(connection) {
        var client = Client.createClient(connection);
        handlers.handle(client);
    });
    
    return {
        listen: server.listen
    };
}
