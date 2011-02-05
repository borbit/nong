var utils = require('../shared/utils'),
    packets = require('../shared/pong').Packets,
    Emitter = require('events').EventEmitter,
    Client = require('./client');

var events = exports.events = {
    STOP: 'stop',
    MOVEUP: 'moveUp',
    MOVEDOWN: 'moveDown',
    JOINGAME: 'joinGame',
    JOINLEFT: 'joinLeft',
    JOINRIGHT: 'joinRight',
    GONE: 'gone',
    PING: 'ping'
};

exports.createPlayer = function(client) {
    var id = utils.getUniqId();
    var emitter = new Emitter();
    var score = 0;

    client.on(Client.events.DISCONNECTED, function() {
        emitter.emit(events.GONE);
    });

    client.on(packets.JoinGame.id, function(data) {
        emitter.emit(events.JOINGAME, data.gameId);
    });

    client.on(packets.ShieldMoveUp.id, function() {
        emitter.emit(events.MOVEUP);
    });

    client.on(packets.ShieldMoveDown.id, function() {
        emitter.emit(events.MOVEDOWN);
    });

    client.on(packets.ShieldStop.id, function() {
        emitter.emit(events.STOP);
    });

    client.on(packets.JoinLeft.id, function() {
        emitter.emit(events.JOINLEFT);
    });

    client.on(packets.JoinRight.id, function() {
        emitter.emit(events.JOINRIGHT);
    });

    client.on(packets.Ping.id, function(data) {
        emitter.emit(events.PING, data.key);
    });

    function updateGameState(gameState) {
        var packet = packets.GameState();
        packet.gameState(gameState.game);
        packet.leftPlayerState(gameState.leftPlayer);
        packet.rightPlayerState(gameState.rightPlayer);
        client.send(packet);
    }

    function updateElements(elements) {
        var packet = packets.GameSnapshot();

        for (var i in elements) {
            packet.addEntityData(elements[i].id, elements[i]);
        }

        client.send(packet);
    }

    function shieldMoveUp(side, x, y, energy) {
        var packet = packets.ShieldMoveUp();
        packet.data({side: side, x: x, y: y, energy: energy});
        client.send(packet);
    }

    function shieldMoveDown(side, x, y, energy) {
        var packet = packets.ShieldMoveDown();
        packet.data({side: side, x: x, y: y, energy: energy});
        client.send(packet);
    }

    function shieldStop(side, x, y) {
        var packet = packets.ShieldStop();
        packet.data({side: side, x: x, y: y});
        client.send(packet);
    }

    function pong(key) {
        var packet = packets.Pong();
        packet.data({key: key});
        client.send(packet);
    }

    function roundStarted(ballData) {
        var packet = packets.RoundStarted();
        packet.data(ballData);
        client.send(packet);
    }

    function on(event, callback) {
        emitter.on(event, callback);
    }

    return {
        on: on,
        pong: pong,
        subscribe: on,
        events: events,
        get id() { return id; },
        get score() { return score; },

        updateGameState: updateGameState,
        updateElements: updateElements,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop,
        roundStarted: roundStarted
    };
};
