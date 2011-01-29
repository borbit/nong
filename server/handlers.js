var comps = require('../shared/components');
var pong = require('../shared/pong');
var Client = require('./client');
var Player = require('./player');

exports.createHandlers = function(game) {
    var clients = [];
    
    game.on(comps.Game.events.STATE_CHANGED, function() {
        broadcast(createGameStatePacket());

        if (game.gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
            game.start();

            var leftPlayer = game.getPlayer('left');
            var rightPlayer = game.getPlayer('right');
        }
    });

    game.on(comps.Game.events.ELEMENTS_CHANGED, function(elements) {
        broadcast(createGameSnapshotPacket(elements));
    });

    /*game.on(Game.events.LEFT_SHIELD_MOVEUP, function() {
        var packet = Packets.ShieldMoveUp();
        packet.data({position: 'left'});
        broadcast(packet);
    });

    game.on(Game.events.LEFT_SHIELD_MOVEDOWN, function() {
        var packet = Packets.ShieldMoveDown();
        packet.data({position: 'left'});
        broadcast(packet);
    });

    game.on(Game.events.LEFT_SHIELD_STOP, function() {
        var packet = Packets.ShieldStop();
        packet.data({position: 'left'});
        broadcast(packet);
    });

    game.on(Game.events.RIGHT_SHIELD_MOVEUP, function() {
        var packet = Packets.ShieldMoveUp();
        packet.data({position: 'right'});
        broadcast(packet);
    });

    game.on(Game.events.RIGHT_SHIELD_MOVEDOWN, function() {
        var packet = Packets.ShieldMoveDown();
        packet.data({position: 'right'});
        broadcast(packet);
    });

    game.on(Game.events.RIGHT_SHIELD_STOP, function() {
        var packet = Packets.ShieldStop();
        packet.data({position: 'right'});
        broadcast(packet);
    });*/
    
    function handle(client) {
        clients.push(client);
        
        client.on(Client.events.DISCONNECTED, function() {
            removeClient(client);
            game.stop();
        });

        client.on(pong.Packets.JoinLeft.id, function() {
            game.joinLeftPlayer(Player.createPlayer(client));
        });

        client.on(pong.Packets.JoinRight.id, function() {
            game.joinRightPlayer(Player.createPlayer(client));
        });

        client.send(createGameStatePacket());
    }
    
    function removeClient(client) {
        var index = clients.indexOf(client);
        if (index >= 0) {
            clients.splice(index, 1);
        }
    }
    
    function broadcast(packet) {
        clients.forEach(function(client) {
            client.send(packet);
        });
    }
    
    function createGameStatePacket() {
        var gameState = game.getState();
        var packet = pong.Packets.GameState();
        packet.gameState(gameState.game);
        packet.leftPlayerState(gameState.leftPlayer);
        packet.rightPlayerState(gameState.rightPlayer);
        return packet;
    }
    
    function createGameSnapshotPacket(elements) {
        var packet = pong.Packets.GameSnapshot();
        
        elements.forEach(function(element, index) {
            packet.addEntityData(element.id, {
                x: element.region.x,
                y: element.region.y
            });
        });
        
        return packet;
    }
    
    return {
        handle: handle
    };
}