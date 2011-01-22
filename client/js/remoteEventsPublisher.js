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
    
    function sendGameState(gameState, leftPlayerState, rightPlayerState) {
        var packet = Pong.Packets.GameState();
        packet.gameState(gameState);
        packet.leftPlayerState(leftPlayerState);
        packet.rightPlayerState(rightPlayerState);
        sendPacket(packet);
    }

    function sendPacket(packet) {
        var payload = Pong.Packets.serialize(packet);
        console.log('Sending packet: ' + payload);
        ws.sendMessage(payload);
    }

    return {
        joinGame: joinGame,
        joinLeft: joinLeft,
        joinRight: joinRight
    };

};