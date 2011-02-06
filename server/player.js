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
    var lastPingTime = null;
    var latency = null;
    var score = 0;

    client.on(Client.events.DISCONNECTED, function() {
        emitter.emit(events.GONE);
    });

    client.on(packets.JoinGame.id, function(data) {
        emitter.emit(events.JOINGAME, data.gameId);
    });

    client.on(packets.ShieldMoveUp.id, function(data) {
        emitter.emit(events.MOVEUP, data.key);
    });

    client.on(packets.ShieldMoveDown.id, function(data) {
        emitter.emit(events.MOVEDOWN, data.key);
    });

    client.on(packets.ShieldStop.id, function(data) {
        emitter.emit(events.STOP, data.key, data.y);
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

    client.on(packets.Pong.id, function(data) {
        latency = Math.floor(((new Date()).getTime() - lastPingTime) / 2);
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

    function shieldMovedUp(side, x, y, energy, key) {
        var packet = packets.ShieldMovedUp();
        packet.data({side: side, x: x, y: y, energy: energy, key: key});
        client.send(packet);
    }
    function shieldMovedDown(side, x, y, energy, key) {
        var packet = packets.ShieldMovedDown();
        packet.data({side: side, x: x, y: y, energy: energy, key: key});
        client.send(packet);
    }
    function shieldStoped(side, x, y, key) {
        var packet = packets.ShieldStoped();
        packet.data({side: side, x: x, y: y, key: key});
        client.send(packet);
    }

    function ping(key) {
        var packet = packets.Ping();
        packet.data({key: utils.getUniqId()});
        client.send(packet);
        lastPingTime = (new Date()).getTime();
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
        get latency() { return latency; },

        updateGameState: updateGameState,
        updateElements: updateElements,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop,
        shieldMovedUp: shieldMovedUp,
        shieldMovedDown: shieldMovedDown,
        shieldStoped: shieldStoped,
        roundStarted: roundStarted,
        ping: ping
    };
};
