Pong.RemoteEventsPublisher = function(ws) {
    
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

    function shieldMoveUp(position) {
        var packet = Pong.Packets.ShieldMoveUp();
        packet.data({position: position});
        sendPacket(packet);
    }

    function shieldMoveDown(position) {
        var packet = Pong.Packets.ShieldMoveDown();
        packet.data({position: position});
        sendPacket(packet);
    }

    function shieldStop(position) {
        var packet = Pong.Packets.ShieldStop();
        packet.data({position: position});
        sendPacket(packet);
    }

    function sendPacket(packet) {
        var payload = Components.Packets.serialize(packet);
        console.log('Sending packet: ' + payload);
        ws.sendMessage(payload);
    }

    return {
        joinGame: joinGame,
        joinLeft: joinLeft,
        joinRight: joinRight,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop
    };

};