(function(ns) {

    ns.PLAYER_STATE_FREE = 'free';
    ns.PLAYER_STATE_CONNECTING = 'connecting';
    ns.PLAYER_STATE_CONNECTED = 'connected';
    
    ns.GAME_STATE_WAITING_FOR_PLAYERS = 'waiting-for-players';
    ns.GAME_STATE_IN_PROGRESS = 'in-progress';
    
}((typeof exports === 'undefined') ? window.Components.Constants = {} : exports.Constants = {}));
