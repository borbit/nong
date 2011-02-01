Pong.EventsRemote.Publisher = function(transport) {
    
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

    return {
        joinGame: joinGame,
        joinLeft: joinLeft,
        joinRight: joinRight,
        shieldMoveUp: shieldMoveUp,
        shieldMoveDown: shieldMoveDown,
        shieldStop: shieldStop
    };

};