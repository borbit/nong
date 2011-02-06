Pong.EventsRemote.Publisher = function(transport) {
    var lastPingTime = null;
    var latency = null;
    var moves = [];
    
    function joinGame(name) {
        var packet = Pong.Packets.JoinGame();
        packet.name(name);
        sendPacket(packet);
    }

    function joinLeft() {
        sendPacket(Pong.Packets.JoinLeft());
    }

    function joinRight() {
        sendPacket(Pong.Packets.JoinRight());
    }

    function ping() {
        var packet = Pong.Packets.Ping();
        packet.data({key: Utils.getUniqId()});
        sendPacket(packet);
        lastPingTime = (new Date()).getTime();
    }
    
    function pong(key) {
        var packet = Pong.Packets.Pong();
        packet.data({key: key});
        sendPacket(packet);
    }

    function shieldMoveUp(side, y) {
        var packet = Pong.Packets.ShieldMoveUp();
        packet.data({side: side, key: moves.length});
        sendPacket(packet);
        moves[moves.length] = y;
    }

    function shieldMoveDown(side, y) {
        var packet = Pong.Packets.ShieldMoveDown();
        packet.data({side: side, key: moves.length});
        sendPacket(packet);
        moves[moves.length] = y;
    }

    function shieldStop(side, y) {
        var packet = Pong.Packets.ShieldStop();
        packet.data({side: side, key: moves.length, y: y});
        sendPacket(packet);
        moves[moves.length] = y;
    }

    function sendPacket(packet) {
        var payload = Components.Packets.serialize(packet);
        console.log('Sending packet: ' + payload);
        transport.sendMessage(payload);
    }

    transport.subscribe(Pong.Packets.Pong.id, function(data) {
        latency = Math.floor(((new Date()).getTime() - lastPingTime) / 2);
        console.log('latency ' + latency);
    });

    transport.subscribe(Pong.Packets.Ping.id, function(data) {
        pong(data.key);
    });

    return {
        ping: ping,
        joinGame: joinGame,
        joinLeft: joinLeft,
        joinRight: joinRight,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop,
        get lastPingTime() {
            return lastPingTime;
        },
        get latency() {
            return latency;
        },
        get moves() {
            return moves;
        }
    };

};