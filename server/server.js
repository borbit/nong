var ws = require('websocket-server');
var Client = require('./client');
var Player = require('./player');
var Game = require('./game');

exports.createServer = function(gameConfig) {
    var game = Game.create(gameConfig);
    var server = ws.createServer();
    
    server.addListener('connection', function(connection) {
        var client = Client.createClient(connection);
        var player = Player.createPlayer(client);
        
        player.on(Player.events.JOINGAME, function(gameId) {
            game.joinPlayer(player);
        });
    });
    
    return {
        listen: server.listen
    };
}
