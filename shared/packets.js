(function(ns) {

var packets = require('./components').Packets;

ns.GameSnapshot = packets.createPacket('GameSnapshot', {
    addEntityData: function(entityId, data) {
        var temp = {};
        temp[entityId] = data;
        this.data(temp);
    }
});


ns.Pong = packets.createPacket('Pong');
ns.Ping = packets.createPacket('Ping');

ns.GameState        = packets.createPacket('GameState');
ns.JoinGame         = packets.createPacket('JoinGame');
ns.JoinLeft         = packets.createPacket('JoinLeft');
ns.JoinRight        = packets.createPacket('JoinRight');
ns.RoundStarted     = packets.createPacket('RoundStarted');

ns.ShieldMoveUp     = packets.createPacket('ShieldMoveUp');
ns.ShieldMoveDown   = packets.createPacket('ShieldMoveDown');
ns.ShieldStop       = packets.createPacket('ShieldStop');

ns.ShieldMovedUp    = packets.createPacket('ShieldMovedUp');
ns.ShieldMovedDown  = packets.createPacket('ShieldMovedDown');
ns.ShieldStoped     = packets.createPacket('ShieldStoped');
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports.Packets = {}));
