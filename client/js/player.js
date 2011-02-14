Pong.Player = function(transport) {
    this.shield = null;
    this.transport = transport;
    var player = this;
    
    this.transport.subscribe(Pong.Packets.ShieldMoveUp.id, function(data) {
        if(data.side == player.shield.id) {
            player.shield.region.y = data.y;
            player.shield.moveUp();
        }
    });

    this.transport.subscribe(Pong.Packets.ShieldMoveDown.id, function(data) {
        if(data.side == player.shield.id) {
            player.shield.region.y = data.y;
            player.shield.moveDown();
        }
    });

    this.transport.subscribe(Pong.Packets.ShieldStop.id, function(data) {
        if(data.side == player.shield.id) {
            player.shield.region.y = data.y;
            player.shield.stop();
        }
    });
}

Pong.Player.prototype = {
    shield: function() {
        return this.shield;
    },

    assignShield: function(shield) {
        this.shield = shield;
    }
}