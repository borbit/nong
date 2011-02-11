var _ = require('../shared/utils')._;

exports.create = function() {
    return new Players();
};

function Players() {
    this.players = {};
}

_.extend(Players.prototype, {
    add: function(player) {
        var id = player.id;
        if (!_.isUndefined(this.players[id])) {
            throw 'Tring to add already added player: ' + id;
        }
        this.players[id] = player;
    },

    remove: function(id) {
        if (_.isUndefined(this.players[id])) {
            throw 'Tring to remove not added player: ' + id;
        }
        delete this.players[id];
    },

    gameState: function(state) {
        _.each(this.players, function(player) {
            player.gameState(state);
        });
    },
    
    gameSnapshot: function(elements) {
        _.each(this.players, function(player) {
            player.gameSnapshot(elements);
        });
    },

    shieldMoveUp: function(side, y, energy) {
        _.each(this.players, function(player) {
            player.shieldMoveUp(side, y, energy);
        });
    },

    shieldMoveDown: function(side, y, energy) {
        _.each(this.players, function(player) {
            player.shieldMoveDown(side, y, energy);
        });
    },

    shieldStop: function(side, y) {
        _.each(this.players, function(player) {
            player.shieldStop(side, y);
        });
    },

    roundStarted: function(data) {
        _.each(this.players, function(player) {
            player.roundStarted(data);
        });
    }
});