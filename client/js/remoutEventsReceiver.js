Pong.RemoutEventsReceiver = function(ws) {

    var observer = Pong.Observer();
    observer.register(Pong.RemoutEventsReceiver.events.GAMESTATE);

    ws.subscribe(Pong.WSAdapter.events.MESSAGE, processMessage);

    function processMessage(payload) {
        var packet = createPacket(payload);

        if (observer.isRegistered(packet.id())) {
            observer.fire(packet.id(), [packet.data()]);
        }
    }

    function createPacket(payload) {
        return Pong.Packets.unserialize(payload);
     }

    return {
        subscribe: observer.subscribe
    };
};

Pong.RemoutEventsReceiver.events = {
    GAMESTATE: 'GameState'
};
