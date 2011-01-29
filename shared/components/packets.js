(function(ns) {

var utils = require('../utils');

ns.Packet = function(packetId) {
    var packetData = {};

    return {
        id: function(id) {
            if(!utils.Functions.isUndefined(id))  {
                packetId = id;
            } else {
                return packetId;
            }
        },
        data: function(data) {
            if(!utils.Functions.isUndefined(data))  {
                packetData = utils.Functions.extend(packetData, data);
            } else {
                return packetData;
            }
        }
    };
};

var packets = {};

ns.createPacket = function(id, addons) {
    function constructor() {
        var packet = ns.Packet(id);
        return utils.Functions.extend(packet, addons);
    }
    constructor.id = id;
    packets[id] = constructor;
    return constructor;
};

ns.serialize = function(packet) {
    return JSON.stringify({
        id: packet.id(),
        data: packet.data()
    });
};

ns.unserialize = function(payload) {
    payload = JSON.parse(payload);
    if (utils.Functions.isUndefined(packets[payload.id])) {
        throw 'Unknown packet ID: ' + payload.id;
    }
    var packet = packets[payload.id].call(null);
    packet.data(payload.data);
    return packet;
};
    
}((typeof exports === 'undefined') ? window.Components.Packets = {} : exports.Packets = {}));
