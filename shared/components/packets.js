(function(ns) {

var utils = require('../utils');

ns.Packet = function(packetId) {
    var packetData = {};

    return {
        id: function(id) {
            if(!utils._.isUndefined(id))  {
                packetId = id;
            } else {
                return packetId;
            }
        },
        data: function(data) {
            if(!utils._.isUndefined(data))  {
                packetData = utils._.extend(packetData, data);
            } else {
                return packetData;
            }
        }
    };
};

var packets = {};

ns.createPacket = function(id, addons) {
    function constructor(packetData) {
        var packet = ns.Packet(id);
        var methods = {};

        if(!utils._.isUndefined(packetData)) {
            packet.data(packetData);
        }

        if(utils._.isArray(addons)) {
            for(var i = 0, len = addons.length; i < len; i++) {
                methods[addons[i]] = (function(name) {
                    return function(value) {
                        if (utils._.isUndefined(value))  {
                            return this.data()[name];
                        }
                        var tmp = {};
                        tmp[name] = value;
                        this.data(tmp);
                        return this;
                    };
                })(addons[i]);
            }
        } else {
            methods = addons;
        }
        
        return utils._.extend(packet, methods);
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
