Pong.RemoteEventsReceiver = function(ws) {
    var observer = Utils.Observer();

    ws.subscribe(Pong.WSAdapter.events.MESSAGE, function(payload) {
        var packet = Components.Packets.unserialize(payload);
        observer.fire(packet.id(), packet.data());
    });

    return {
        subscribe: observer.subscribe
    };
};
