Pong.RemoutEventsPublisher = function(ws) {

    function joinLeft() {
        sendPacket(Pong.Packets.JoinLeft());
    }

    function joinRight() {
        sendPacket(Pong.Packets.JoinRight());
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