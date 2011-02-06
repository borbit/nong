Pong.Player = function(transport) {
    var packets = Pong.Packets;
    var lastPingTime = null;
    var latency = null;
    var moves = [];

    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown',
        STOPED: 'stoped',
        MOVEDUP: 'movedUp',
        MOVEDDOWN: 'movedDown',
        GAMESTATE: 'gameState',
        ROUNDSTARTED: 'roundStarted',
        GAMESNAPSHOT: 'gameSnapshot'
    };

    var observer = Utils.Observer();

    transport.subscribe(packets.GameState.id, function(data) {
        observer.fire(events.GAMESTATE, data);
    });
    transport.subscribe(packets.RoundStarted.id, function(data) {
        observer.fire(events.ROUNDSTARTED, data);
    });
    transport.subscribe(packets.GameSnapshot.id, function(data) {
        observer.fire(events.GAMESNAPSHOT, data);
    });

    transport.subscribe(packets.ShieldMoveUp.id, function(data) {
        observer.fire(events.MOVEUP, data);
    });
    transport.subscribe(packets.ShieldMoveDown.id, function(data) {
        observer.fire(events.MOVEDOWN, data);
    });
    transport.subscribe(packets.ShieldStop.id, function(data) {
        observer.fire(events.STOP, data);
    });

    transport.subscribe(packets.ShieldMovedUp.id, function(data) {
        observer.fire(events.MOVEDUP, data);
    });
    transport.subscribe(packets.ShieldMovedDown.id, function(data) {
        observer.fire(events.MOVEDDOWN, data);
    });
    transport.subscribe(packets.ShieldStoped.id, function(data) {
        observer.fire(events.STOPED, data);
    });

    transport.subscribe(packets.Pong.id, function(data) {
        latency = Math.floor(((new Date()).getTime() - lastPingTime) / 2);
        console.log('latency ' + latency);
    });
    transport.subscribe(packets.Ping.id, function(data) {
        pong(data.key);
    });

    function joinGame(name) {
        sendPacket(packets.JoinGame({name: name}));
    }

    function joinLeft() {
        sendPacket(packets.JoinLeft());
    }

    function joinRight() {
        sendPacket(packets.JoinRight());
    }

    function ping() {
        lastPingTime = (new Date()).getTime();
        sendPacket(packets.Ping({key: Utils.getUniqId()}));
    }

    function pong(key) {
        sendPacket(packets.Pong({key: key}));
    }

    function shieldMoveUp(side, y) {
        sendPacket(packets.ShieldMoveUp({
            side: side, key: moves.length
        }));
        moves[moves.length] = y;
    }

    function shieldMoveDown(side, y) {
        sendPacket(packets.ShieldMoveDown({
            side: side, key: moves.length
        }));
        moves[moves.length] = y;
    }

    function shieldStop(side, coordY) {
        sendPacket(packets.ShieldStop({
            side: side, key: moves.length, coordY: coordY
        }));
        moves[moves.length] = coordY;
    }

    function sendPacket(packet) {
        var payload = Components.Packets.serialize(packet);
        console.log('Sending packet: ' + payload);
        transport.sendMessage(payload);
    }

    return {
        ping: ping,
        joinGame: joinGame,
        joinLeft: joinLeft,
        joinRight: joinRight,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop,
        subscribe: observer.subscribe,
        events: events,

        get latency() { return latency; },
        get moves() { return moves; }
    };

};