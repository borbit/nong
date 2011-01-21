Pong.RemoutEventsReceiver = function(ws) {

    var observer = Pong.Observer();
    observer.register(Pong.RemoutEventsReceiver.events.GAMESTATE);

    ws.subscribe(Pong.WSAdapter.events.MESSAGE, processMessage);

    function processMessage(payload) {
        var packet = createPacket(payload);

        if(observer.isRegistered(packet.name())) {
            observer.fire(packet.name(), [packet.data()]);
        }
    }

    function createPacket(payload) {
        var PacketClass = Pong.Packets[payload.name];

        if(PacketClass == null) {
            throw 'Unknown packet: ' + payload.name;
        }

        var packet = PacketClass();
        packet.data(payload.data);
        return packet;
     }

    return {
        subscribe: observer.subscribe
    };
};

Pong.RemoutEventsReceiver.events = {
    GAMESTATE: 'GameState'
};