Pong.RemoteEventsReceiver = function(ws) {

    var observer = Pong.Observer();
    observer.register(Pong.RemoteEventsReceiver.events.GAMESTATE);

    ws.subscribe(Pong.WSAdapter.events.MESSAGE, processMessage);

    function processMessage(payload) {
        var packet = Pong.Packets.unserialize(payload);

        if (observer.isRegistered(packet.id())) {
            observer.fire(packet.id(), [packet.data()]);
        }
    }

    return {
        subscribe: observer.subscribe
    };
};

Pong.RemoteEventsReceiver.events = {
    GAMESTATE: 'GameState'
};
