var ws = require('websocket-server');
var wsClient = require('./ws-client');
var packets = require('../shared/packets');

exports.createServer = function() {
    var server = ws.createServer();
    var games = {};
    var clients = [];
    
    server.addListener('connection', function(connection) {
        var client = wsClient.createClient(connection);
        clients.push(client);
        client.on(wsClient.events.PACKET, function(packet){
            if (packet.id() == packets.JoinGame.id) {
                var game = games[packet.data().name];
                game.addClient(client);
            }
        });
    });
    
    function addGame(name, game) {
        if (games[name] != null) {
            throw 'Game name already taken';
        }
        games[name] = game;
    }
    
    return {
        listen: server.listen,
        addGame: addGame
    };
}
