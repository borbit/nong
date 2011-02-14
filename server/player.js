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
        emitter.emit(events.STOP, data.key, data.coordY);
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

    function gameState(state) {
        client.send(packets.GameState(state));
    }

    function gameSnapshot(elements) {
        var packet = packets.GameSnapshot();
        for (var i in elements) {
            packet.addEntityData(elements[i].id, elements[i]);
        }
        client.send(packet);
    }

    function shieldMoveUp(side, y, energy) {
        client.send(packets.ShieldMoveUp({
            y: y, side: side,
            energy: energy
        }));
    }
    function shieldMoveDown(side, y, energy) {
        client.send(packets.ShieldMoveDown({
            y: y, side: side,
            energy: energy
        }));
    }
    function shieldStop(side, y) {
        client.send(packets.ShieldStop({
            y: y, side: side
        }));
    }

    function shieldMovedUp(side, y, key) {
        client.send(packets.ShieldMovedUp({
            side: side, y: y, key: key
        }));
    }
    function shieldMovedDown(side, y, key) {
        client.send(packets.ShieldMovedDown({
            side: side, y: y, key: key
        }));
    }
    function shieldStoped(side, y, key) {
        client.send(packets.ShieldStoped({
            side: side, y: y, key: key
        }));
    }

    function ping(key) {
        client.send(packets.Ping({key: utils.getUniqId()}));
        lastPingTime = (new Date()).getTime();
    }
    function pong(key) {
        client.send(packets.Pong({key: key}));
    }

    function roundStarted(data) {
        var packet = packets.RoundStarted();
        packet.data(data);
        client.send(packet);
    }

    function scoresChanged(data) {
        var packet = packets.ScoresChanged();
        packet.data(data);
        client.send(packet);
    }

    function gameFinished(data) {
        var packet = packets.GameFinished();
        packet.data(data);
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

        gameState: gameState,
        gameSnapshot: gameSnapshot,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop,
        shieldMovedUp: shieldMovedUp,
        shieldMovedDown: shieldMovedDown,
        shieldStoped: shieldStoped,
        roundStarted: roundStarted,
        scoresChanged: scoresChanged,
        gameFinished: gameFinished,
        ping: ping
    };
};
