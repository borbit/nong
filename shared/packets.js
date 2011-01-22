(function(ns) {
    var hasRequire = (typeof require !== 'undefined'),
        constants = hasRequire ? require('./constants') : window.Pong.Constants,
        functions = hasRequire ? require('./functions') : window.Pong.Functions;
    
    var packets = {};
    packets.add = function(packet) {
        packets[packet.id] = packet;
    };
    
    ns.Packet = function(packetId) {
        var packetData = {};

        return {
            id: function(id) {
                if(!functions.isUndefined(id))  {
                    packetId = id;
                } else {
                    return packetId;
                }
            },
            data: function(data) {
                if(!functions.isUndefined(data))  {
                    packetData = functions.extend(packetData, data);
                } else {
                    return packetData;
                }
            }
        };
    };
    
    ns.GameState = function() {
        var packet = ns.Packet(ns.GameState.id);

        packet.data({
            gameState: constants.GAME_STATE_IN_PROGRESS,
            leftPlayerState: constants.PLAYER_STATE_FREE,
            rightPlayerState: constants.PLAYER_STATE_FREE
        });
        
        function gameState(state) {
            if(!functions.isUndefined(state))  {
                packet.data({gameState: state});
            } else {
                return packet.data().gameState;
            }
        }
        
        function leftPlayerState(state) {
            if(!functions.isUndefined(state))  {
                packet.data({leftPlayerState: state});
            } else {
                return packet.data().leftPlayerState;
            }
        }
        
        function rightPlayerState(state) {
            if(!functions.isUndefined(state))  {
                packet.data({rightPlayerState: state});
            } else {
                return packet.data().rightPlayerState;
            }
        }
        
        return functions.extend(packet, {
            gameState: gameState,
            leftPlayerState: leftPlayerState,
            rightPlayerState: rightPlayerState
        });
    };
    ns.GameState.id = 'GameState';
    packets.add(ns.GameState);
    
    ns.JoinGame = function() {
        var packet = ns.Packet(ns.JoinGame.id);
        
        function name(name) {
            if(!functions.isUndefined(name))  {
                packet.data({name: name});
            } else {
                return packet.data().name;
            }
        }
        
        return functions.extend(packet, {
            name: name
        });
    };
    ns.JoinGame.id = 'JoinGame';
    packets.add(ns.JoinGame);
    
    ns.JoinLeft = function() {
        return ns.Packet(ns.JoinLeft.id);
    };
    ns.JoinLeft.id = 'JoinLeft';
    packets.add(ns.JoinLeft);
    
    ns.JoinRight = function() {
        return ns.Packet(ns.JoinRight.id);
    };
    ns.JoinRight.id = 'JoinRight';
    packets.add(ns.JoinRight);
    
    ns.serialize = function(packet) {
        return JSON.stringify({
            id: packet.id(),
            data: packet.data()
        });
    };
    
    ns.unserialize = function(payload) {
        payload = JSON.parse(payload);
        if (functions.isUndefined(packets[payload.id])) {
            throw 'Unknown packet ID: ' + payload.id; 
        }
        var packet = packets[payload.id].call(null);
        packet.data(payload.data);
        return packet;
    };
    
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports));
