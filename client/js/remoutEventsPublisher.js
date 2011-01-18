Pong.RemoutEventsPublisher = function(ws) {

    function joinLeft() {
        ws.sendPacket(Pong.Packets.JoinLeft());
    }

    function joinRight() {
        ws.sendPacket(Pong.Packets.JoinRight());
    }

    return {
        joinLeft: joinLeft,
        joinRight: joinRight
    };

};