Pong.Player = function(transport) {
    var shield = null;
    var packets = Pong.Packets;
    var keyboard = Pong.EventsClient.KeyboardReceiver;

    keyboard.subscribe(keyboard.events.MOVEUP, function() {
        sendPacket(packets.ShieldMoveUp({side: shield.id}));
    });
    keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
        sendPacket(packets.ShieldMoveDown({side: shield.id}));
    });
    keyboard.subscribe(keyboard.events.STOP, function() {
        sendPacket(packets.ShieldStop({side: shield.id}));
    });

    transport.subscribe(packets.ShieldMoveUp.id, function(data) {
        if(data.side == shield.id) {
            shield.region.y = data.y;
            shield.moveUp();
        }
    });
    transport.subscribe(packets.ShieldMoveDown.id, function(data) {
        if(data.side == shield.id) {
            shield.region.y = data.y;
            shield.moveDown();
        }
    });
    transport.subscribe(packets.ShieldStop.id, function(data) {
        if(data.side == shield.id) {
            shield.region.y = data.y;
            shield.stop();
        }
    });
    
    /*
    transport.subscribe(packets.ShieldMovedUp.id, function(data) {});
    transport.subscribe(packets.ShieldMovedDown.id, function(data) {});
    transport.subscribe(packets.ShieldStoped.id, function(data) {});
     */

    
    function joinGame(name) {
        sendPacket(packets.JoinGame({name: name}));
    }
    function joinLeft() {
        sendPacket(packets.JoinLeft());
    }
    function joinRight() {
        sendPacket(packets.JoinRight());
    }

    function assignShield(_shield) {
        shield = _shield;
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
        assignShield: assignShield,
        get shield() { return shield; }
    };
};