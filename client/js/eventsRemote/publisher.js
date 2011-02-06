Pong.EventsRemote.Publisher = function(transport) {
    var packets = Pong.Packets;
    var lastPingTime = null;
    var latency = null;
    var moves = [];
    
    function joinGame(name) {
        sendPacket(packets.JoinGame().name(name));
    }

    function joinLeft() {
        sendPacket(packets.JoinLeft());
    }

    function joinRight() {
        sendPacket(packets.JoinRight());
    }

    function ping() {
        lastPingTime = (new Date()).getTime();
        sendPacket(packets.Ping().key(Utils.getUniqId()));
    }
    
    function pong(key) {
        sendPacket(packets.Pong().key(key));
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

    transport.subscribe(packets.Pong.id, function(data) {
        latency = Math.floor(((new Date()).getTime() - lastPingTime) / 2);
        console.log('latency ' + latency);
    });

    transport.subscribe(packets.Ping.id, function(data) {
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

        get latency() { return latency; },
        get moves() { return moves; }
    };

};