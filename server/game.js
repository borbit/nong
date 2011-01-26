var Constants = require('../shared/constants'),
    Emitter = require('events').EventEmitter,
    Functions = require('./functions'),
    Client = require('./client');

var events = exports.events = {
    ELEMENTS_CHANGED: 'elementsChanged',
    STATE_CHANGED: 'stateChanged'
};

exports.createGame = function(settings) {
    var emitter = new Emitter(),
        gameState = Constants.GAME_STATE_WAITING_FOR_PLAYERS;

    var players = {};
    var joined = 0;

    settings = Functions.extend({
        minPlayersCount: 2,
        maxPlayersCount: 2
    }, settings);

    function joinPlayer(id, client) {
        if (!Functions.isUndefined(players[id])) {
            throw 'Tring to connect already connected player: ' + id;
        }
        if (settings.maxPlayersCount - joined == 0) {
            throw 'Tring to connect player when max players count is reached';
        }
        
        players[id] = client;
        joined++;

        client.on(Client.events.DISCONNECTED, function() {
            freePlayer(id);
        });
        
        if (joined == settings.minPlayersCount) {
            gameState = Constants.GAME_STATE_IN_PROGRESS;
        }
        
        emitter.emit(events.STATE_CHANGED);
    }
    
    function freePlayer(id) {
        if(Functions.isUndefined(players[id])) {
            throw 'Tring to free not connected player: ' + id;
        }

        delete players[id];
        joined--;

        if(joined < settings.minPlayersCount) {
            gameState = Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        }

        emitter.emit(events.STATE_CHANGED);
    }

    function getPlayer(id) {
        if(Functions.isUndefined(players[id])) {
            return false;
        }
        return players[id];
    }
        
    return {
        emitter: emitter,
        players: players,
        gameState: gameState,
        joinPlayer: joinPlayer,
        freePlayer: freePlayer,
        getPlayer: getPlayer
    };
};
