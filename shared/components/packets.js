(function(ns) {

var utils = require('../utils');

ns.Packet = function(packetId) {
    var packetData = {};

    return {
        id: function(id) {
            if(!utils._.isUndefined(id))  {
                packetId = id;
            }

            return packetId;
        },
        data: function(data) {
            if(!utils._.isUndefined(data))  {
                packetData = utils._.extend(packetData, data);
            }
            
            return packetData;
        }
    };
};

var packets = {};

ns.createPacket = function(id, addons) {
    function constructor(packetData) {
        var packet = ns.Packet(id);

        if(!utils._.isUndefined(packetData)) {
            packet.data(packetData);
        }

        if(!utils._.isUndefined(addons)) {
            packet = utils._.extend(packet, addons);
        }
        return packet;
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
    if (utils._.isUndefined(packets[payload.id])) {
        throw 'Unknown packet ID: ' + payload.id;
    }
    var packet = packets[payload.id].call(null);
    packet.data(payload.data);
    return packet;
};

}((typeof exports === 'undefined') ? window.Components.Packets = {} : exports.Packets = {}));
