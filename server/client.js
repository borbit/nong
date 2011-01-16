var packets = require('../shared/packets');

var Client = exports.Client = function(connection) {
    var self = this;
    this.game = null;
    
    this.connection = connection;
    this.connection.addListener('message', function(message) {
        self._processMessage(message);
    });
    this.connection.addListener('close', function() {
        self.game.left(self);
    });
};

Client.prototype.setGame = function(game) {
    this.game = game;
};

Client.prototype.send = function(packet) {
    var payload = {
        name: packet.getName(),
        data: packet.getData()
    };
    this.connection.send(JSON.stringify(payload));
    console.log('Sent packet: ' + packet.getName());
};

Client.prototype._processMessage = function(message) {
    var payload = JSON.parse(message);
    var packet = this._createPacket(payload);
    var packetName = packet.getName();
    console.log('Received packet: ' + packetName);
    switch (packetName) {
        case 'JoinLeft':
            this._processJoinLeft(packet);
            break;
            
        case 'JoinRight':
            this._processJoinRight(packet);
            break;

        
        default:
            throw 'Unknown packet: ' + packetName;
    }
};

Client.prototype._processJoinLeft = function(packet) {
    this.game.joinLeft(this);
};

Client.prototype._processJoinRight = function(packet) {
    this.game.joinRight(this);
};

Client.prototype._createPacket = function(payload) {
    var name = payload.name;
    if (typeof packets[name] === 'undefined') {
        throw 'Unknown packet: ' + name;
    }
    
    var packet = new packets[name];
    packet.setData(payload.data);
    return packet;
}
