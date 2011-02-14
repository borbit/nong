Pong.LocalPlayer = function(transport) {
    Pong.Player.call(this, transport);

    this.keyboard = Pong.EventsClient.KeyboardReceiver;

    var player = this;

    this.keyboard.subscribe(this.keyboard.events.MOVEUP, function() {
        player.sendPacket(Pong.Packets.ShieldMoveUp({side: player.shield.id}));
    });

    this.keyboard.subscribe(this.keyboard.events.MOVEDOWN, function() {
        player.sendPacket(Pong.Packets.ShieldMoveDown({side: player.shield.id}));
    });

    this.keyboard.subscribe(this.keyboard.events.STOP, function() {
        player.sendPacket(Pong.Packets.ShieldStop({side: player.shield.id}));
    });
}

Utils.inherit(Pong.LocalPlayer, Pong.Player);

Utils._.extend(Pong.LocalPlayer.prototype, {
    joinGame: function(name) {
        this.sendPacket(Pong.Packets.JoinGame({name: name}));
    },

    joinLeft: function() {
        this.sendPacket(Pong.Packets.JoinLeft());
    },

    joinRight: function() {
        this.sendPacket(Pong.Packets.JoinRight());
    },

    sendPacket: function(packet) {
        var payload = Components.Packets.serialize(packet);
        console.log('Sending packet: ' + payload);
        this.transport.sendMessage(payload);
    }
});
