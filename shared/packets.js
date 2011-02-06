(function(ns) {

var packets = require('./components').Packets;

ns.GameSnapshot = packets.createPacket('GameSnapshot', {
    addEntityData: function(entityId, data) {
        var temp = {};
        temp[entityId] = data;
        this.data(temp);
    }
});


ns.Pong = packets.createPacket('Pong', ['key']);
ns.Ping = packets.createPacket('Ping', ['key']);

ns.GameState        = packets.createPacket('GameState', ['game', 'leftPlayer', 'rightPlayer']);

ns.JoinGame         = packets.createPacket('JoinGame', ['name']);
ns.JoinLeft         = packets.createPacket('JoinLeft');
ns.JoinRight        = packets.createPacket('JoinRight');
ns.RoundStarted     = packets.createPacket('RoundStarted');

ns.ShieldMoveUp     = packets.createPacket('ShieldMoveUp', ['side', 'key', 'y', 'energy']);
ns.ShieldMoveDown   = packets.createPacket('ShieldMoveDown', ['side', 'key', 'y', 'energy']);
ns.ShieldStop       = packets.createPacket('ShieldStop', ['side', 'key', 'y']);

ns.ShieldMovedUp    = packets.createPacket('ShieldMovedUp');
ns.ShieldMovedDown  = packets.createPacket('ShieldMovedDown');
ns.ShieldStoped     = packets.createPacket('ShieldStoped');
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports.Packets = {}));
