Pong.EventsRemote.Publisher = function(transport) {
    var lastPingTime = null;
    var latency = null;
    
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

    function shieldMoveUp(side) {
        var packet = Pong.Packets.ShieldMoveUp();
        packet.data({side: side});
        sendPacket(packet);
    }

    function shieldMoveDown(side) {
        var packet = Pong.Packets.ShieldMoveDown();
        packet.data({side: side});
        sendPacket(packet);
    }

    function shieldStop(side) {
        var packet = Pong.Packets.ShieldStop();
        packet.data({side: side});
        sendPacket(packet);
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
        }
    };

};