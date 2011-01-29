var comps = require('../components'),
    utils = require('../utils'),
    Emitter = require('events').EventEmitter,
    Player = require('../../server/player');

exports.Game = {};

var events = exports.Game.events = {
    ELEMENTS_CHANGED: 'elementsChanged',
    STATE_CHANGED: 'stateChanged'
};

exports.Game.createGame = function(stage, settings) {
    var players = {},
        emitter = new Emitter(),
        gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;

    settings = utils.Functions.extend({
        minPlayersCount: 2,
        maxPlayersCount: 2
    }, settings);

    stage.subscribe(comps.Stage.events.changed, function(elements) {
        emitter.emit(events.ELEMENTS_CHANGED, elements);
    });

    function joinPlayer(player) {
        var id = player.id;
        
        if (!utils.Functions.isUndefined(players[id])) {
            throw 'Tring to connect already connected player: ' + id;
        }
        if (utils.Functions.size(players) == settings.maxPlayersCount) {
            throw 'Tring to connect player when max players count is reached';
        }
        
        players[id] = player;
        
        player.on(Player.events.GONE, function() {
            freePlayer(id);
        });

        emitter.emit(events.STATE_CHANGED);
    }
    
    function freePlayer(id) {
        console.log(1);
        console.dir(players);
        if (utils.Functions.isUndefined(players[id])) {
            throw 'Tring to free not connected player: ' + id;
        }

        delete players[id];

        emitter.emit(events.STATE_CHANGED);
    }

    function getPlayer(id) {
        if (utils.Functions.isUndefined(players[id])) {
            return false;
        }
        return players[id];
    }

    function addEventsListener(event, callback) {
        emitter.on(event, callback);
    }

    function fireEvent(event) {
        emitter.emmit(event);
    }
        
    return {
        joinPlayer: joinPlayer,
        freePlayer: freePlayer,
        getPlayer: getPlayer,
        on: addEventsListener,
        fire: fireEvent,
        
        get gameState() { return gameState; },
        set gameState(state) { gameState = state; },
        get players() { return players; },
        get emitter() { return emitter; }
    };
};
