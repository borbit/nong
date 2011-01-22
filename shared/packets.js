(function(ns) {
    var hasRequire = (typeof require !== 'undefined'),
        constants = hasRequire ? require('constants').Constants : window.Pong.Constants,
        functions = hasRequire ? require('./functions').Functions : window.Pong.Functions;

    ns.Names = {
        GAME_STATE: 'GameState',
        JOIN_RIGHT: 'JoinRight',
        JOIN_LEFT: 'JoinLeft'
    };

    ns.Packet = function(packetName) {
        var packetData = {};

        return {
            name: function(name) {
                if(!functions.isUndefined(name))  {
                    packetName = _name;
                } else {
                    return packetName;
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
        var packet = ns.Packet(ns.Names.GAME_STATE);

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
    
    ns.JoinLeft = function() {
        return ns.Packet(ns.Names.JOIN_LEFT);
    };
    
    ns.JoinRight = function() {
        return ns.Packet(ns.Names.JOIN_RIGHT);
    };
    
    ns.factory = function(packetName) {
        if (typeof ns[packetName] === 'undefined') {
            return false;
        }
        
        return ns[packetName].call(null);
    };
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports));
