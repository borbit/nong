var pong = require('../shared/pong'),
    utils = require('../shared/utils'),
    Emitter = require('events').EventEmitter,
    Client = require('./client');

var events = exports.events = {
    STOP: 'stop',
    MOVEUP: 'moveUp',
    MOVEDOWN: 'moveDown',
    JOINGAME: 'joinGame',
    JOINLEFT: 'joinLeft',
    JOINRIGHT: 'joinRight',
    GONE: 'gone'
};
    
exports.createPlayer = function(client) {
    var id = utils.getUniqId();
    var emitter = new Emitter();
    var score = 0;

    client.on(Client.events.DISCONNECTED, function() {
        emitter.emit(events.GONE);
    });

    client.on(pong.Packets.JoinGame.id, function(data) {
        emitter.emit(events.JOINGAME, data.gameId);
    });

    client.on(pong.Packets.ShieldMoveUp.id, function() {
        emitter.emit(events.MOVEUP);
    });
    
    client.on(pong.Packets.ShieldMoveDown.id, function() {
        emitter.emit(events.MOVEDOWN);
    });
    
    client.on(pong.Packets.ShieldStop.id, function() {
        emitter.emit(events.STOP);
    });

    client.on(pong.Packets.JoinLeft.id, function() {
        emitter.emit(events.JOINLEFT);
    });

    client.on(pong.Packets.JoinRight.id, function() {
        emitter.emit(events.JOINRIGHT);
    });

    function updateGameState(gameState) {
        var packet = pong.Packets.GameState();
        packet.gameState(gameState.game);
        packet.leftPlayerState(gameState.leftPlayer);
        packet.rightPlayerState(gameState.rightPlayer);
        client.send(packet);
    }

    function updateElements(elements) {
        var packet = pong.Packets.GameSnapshot();

        elements.forEach(function(element) {
            packet.addEntityData(element.id, {
                x: element.region.x,
                y: element.region.y
            });
        });

        client.send(packet);
    }

    function shieldMoveUp(side, x, y) {
        var packet = pong.Packets.ShieldMoveUp();
        packet.data({side: side, x: x, y: y});
        client.send(packet);
    }

    function shieldMoveDown(side, x, y) {
        var packet = pong.Packets.ShieldMoveDown();
        packet.data({side: side, x: x, y: y});
        client.send(packet);
    }

    function shieldStop(side, x, y) {
        var packet = pong.Packets.ShieldStop();
        packet.data({side: side, x: x, y: y});
        client.send(packet);
    }

    function on(event, callback) {
        emitter.on(event, callback);
    }

    return {
        on: on,
        subscribe: on,
        events: events,
        get id() { return id; },
        get score() { return score; },

        updateGameState: updateGameState,
        updateElements: updateElements,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop
    };
};
