Pong.RemoteEventsReceiver = function(ws) {
    var observer = Pong.Observer();

    ws.subscribe(Pong.WSAdapter.events.MESSAGE, function(payload) {
        var packet = Pong.Packets.unserialize(payload);
        observer.fire(packet.id(), packet.data());
    });

    return {
        subscribe: observer.subscribe
    };
};
