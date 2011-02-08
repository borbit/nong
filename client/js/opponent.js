Pong.Opponent = function(transport) {
    var shield = null;
    var packets = Pong.Packets;

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

    function assignShield(_shield) {console.log(_shield);
        shield = _shield;
    }

    return {
        assignShield: assignShield
    };
};