Pong.Opponent = function(transport) {
    var shield = null;
    var packets = Pong.Packets;

    transport.subscribe(packets.ShieldMoveUp.id, function(data) {
        shield.region.y = data.y;
        shield.moveUp();
    });
    transport.subscribe(packets.ShieldMoveDown.id, function(data) {
        shield.region.y = data.y;
        shield.moveDown();
    });
    transport.subscribe(packets.ShieldStop.id, function(data) {
        shield.region.y = data.y;
        shield.stop();
    });

    function assignShield(shield) {
        this.shield = shield;
    }

    return {
        assignShield: assignShield
    };

};