(function(ns) {

var utils = require('./utils'),
    comps = require('./components');

ns.GameState = comps.Packets.createPacket('GameState', {
    gameState: function(state) {
        if(utils._.isUndefined(state))  {
            return this.data().gameState;
        }
        this.data({gameState: state});
    },

    leftPlayerState: function(state) {
        if(utils._.isUndefined(state))  {
            return this.data().leftPlayerState;
        }
        this.data({leftPlayerState: state});
    },

    rightPlayerState: function(state) {
        if(utils._.isUndefined(state))  {
            return this.data().rightPlayerState;
        }
        this.data({rightPlayerState: state});
    }
});

ns.JoinGame = comps.Packets.createPacket('JoinGame', {
    name: function(name) {
        if (utils._.isUndefined(name))  {
            return this.data().name;
        }
        this.data({name: name});
    }
});

ns.GameSnapshot = comps.Packets.createPacket('GameSnapshot', {
    addEntityData: function(entityId, data) {
        var temp = {};
        temp[entityId] = data;
        this.data(temp);
    }
});

ns.JoinLeft = comps.Packets.createPacket('JoinLeft');
ns.JoinRight = comps.Packets.createPacket('JoinRight');
ns.ShieldMoveUp = comps.Packets.createPacket('ShieldMoveUp');
ns.ShieldMoveDown = comps.Packets.createPacket('ShieldMoveDown');
ns.ShieldStop = comps.Packets.createPacket('ShieldStop');
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports.Packets = {}));
