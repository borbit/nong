var vows = require('vows'),
    assert = require('assert');

var Packets = require('../../shared/components/packets.js').Packets;

vows.describe('Packets module').addBatch({
    'has class Pocket. When creating a new instance of Packet': {
        topic: function() {
            return Packets.Packet('somePacket');
        },

        'creates object for it': function (packet) {
            assert.isObject(packet);
        },

        'it contains method "id"': function (packet) {
            assert.includes(packet, 'id');
            assert.isFunction(packet.id);
        },

        'and it contains method "data"': function (packet) {
            assert.includes(packet, 'data');
            assert.isFunction(packet.data);
        },

        'when callind packet.id': {
            topic: function(packet) {
                return packet.id;
            },

            'without arguments it returns current packet id': function(packetIdFunction) {
                assert.equal(packetIdFunction(), 'somePacket');
            },

            'with argument it returns new packet id': function(packetIdFunction) {
                assert.equal(packetIdFunction('someOtherPacketId'), 'someOtherPacketId');
            },

            'with argument modifies current packet id': function(packetIdFunction) {
                packetIdFunction('someNewPacketId');
                assert.equal(packetIdFunction(), 'someNewPacketId');
            }
        },

        'when callind packet.data': {
            topic: function(packet) {
                return packet.data;
            },

            'without arguments it returns current packet data': function(packetDataFunction) {
                assert.deepEqual(packetDataFunction(), {});
            },

            'with argument it returns new packet data': function(packetDataFunction) {
                assert.deepEqual(packetDataFunction({'key': 'some value'}), {'key': 'some value'});
            },

            'with argument modifies current packet data': function(packetIdFunction) {
                packetIdFunction({'key': 'some value'});
                assert.deepEqual(packetIdFunction(), {'key': 'some value'});
            }
        }

    }
}).addBatch({
    'has function createPacket. When calling createPacket': {
        topic: function() {
            return Packets.createPacket;
        },

        'it returns constructor of packet': function(createPacket) {
            assert.isFunction(createPacket('id'));
        },

        'without addons, when creating an instance': {
            topic: function(createPacket) {
                return createPacket('id')();
            },

            'contains method "id"': function(packet) {
                assert.isFunction(packet.id);
            },

            'contains method "data"': function(packet) {
                assert.isFunction(packet.data);
            }

        },

        'with addons, when creating an instance contains addons': function(createPacket) {
            var packet = createPacket('id', {
                'someMathod': 42
            })();

            assert.includes(packet, 'someMathod');
            assert.equal(packet.someMathod, 42);
        }
    }
}).addBatch({
    'has function serialize. When calling serialize': {
        topic: function() {
            return Packets.serialize;
        },

        'converts packet to JSON': function(serialize) {
            assert.equal(serialize(Packets.Packet('somePacket')), '{"id":"somePacket","data":{}}');
        },

        'when packet contains data it is also present': function(serialize) {
            var packet = Packets.Packet('somePacket');
            packet.data({key: 'value'});

            assert.equal(serialize(packet), '{"id":"somePacket","data":{"key":"value"}}');
        }
    }
}).addBatch({
    'has function unserialize': {
        topic: '',

        'if packet with id "somePacket" was created by "createPacket"': {
            topic: function() {
                Packets.createPacket('somePacket', {});

                return '{"id":"somePacket","data":{}}';
            },

            'unserialize function returns instance of it': function(JSON) {
                var packet = Packets.unserialize(JSON);

                assert.isObject(packet);
                assert.includes(packet, 'id');
                assert.includes(packet, 'data');
            }
        },

        'if packet with id "someOtherPacket" was not created': {
            topic: function() {
                return '{"id":"someOtherPacket","data":{}}';
            },

            'unserialize function throws exception': function(JSON) {
                assert.throws(function() {
                    Packets.unserialize(JSON);
                }, 'Unknown packet ID: someOtherPacket');
            }
        }
    }
}).export(module);