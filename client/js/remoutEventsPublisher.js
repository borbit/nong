Pong.RemoutEventsPublisher = function(ws) {

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
        var payload = JSON.stringify({
            name: packet.name(),
            data: packet.data()
        });
        console.log('Sending packet: ' + payload);
        ws.sendMessage(payload);
    }

    return {
        joinLeft: joinLeft,
        joinRight: joinRight
    };

};