var pong = require('../shared/pong'),
    webworkerGame = require('./webworkerGame'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Players = require('./players'),
    Player = require('./player');

exports.create = function() {
    return new Game();
};

function Game() {
    this.webworkerGame = new WebworkerGame();

    this.players = Players.create();
    this.active = {left: null, right: null};
    this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
    this.snapshotter = null;
    this.reset();

    //TODO: subscribe to webworker events:
    //scoresChanged, gameFinished, roundStarted

    /*var game = this;
    
    this.webworkerGame.stage.subscribe(pong.Stage.events.goalHit, function(goal) {
        for (var key in game.goals) {
            if (game.goals[key] == goal) {
                game.scores[key] += 1;

                game.players.scoresChanged({
                    scores: game.scores
                });
            }
        }

        if (game.canBeFinished()) {
            game.finish();
        }
        else {
            game.restartRound();
        }
    });*/
}

Game.prototype.joinPlayer = function(player) {
    var that = this;
    that.players.add(player);

    player.on(Player.events.GONE, function() { that.players.remove(player.id); });
    player.on(Player.events.JOINLEFT, function() { that.assignShield('left', player); });
    player.on(Player.events.JOINRIGHT, function() { that.assignShield('right', player); });
    player.on(Player.events.PING, function(key) { player.pong(key); });

    player.gameState(that.getState());
};

Game.prototype.assignShield = function(side, player) {
    if (!utils._.isNull(this.active[side])) {
        return;
    }

    var game = this;

    player.on(Player.events.GONE, function() {
        /*game.pause();
        game.reset();*/
        //TODO: post "playerGone" message to webworker
        game.active[side] = null;
        game.updateGameState();
    });

    var shield = game.webworkerGame.shields[side];

    player.on(Player.events.MOVEUP, function(key) {
        //TODO: post "shieldMoveUp" message to webworker
        //shield.moveUp();
        //game.players.shieldMoveUp(side, shield.region.y);
        //player.shieldMovedUp(side, shield.region.y, key)
    });
    player.on(Player.events.MOVEDOWN, function(key) {
        //TODO: post "shieldMoveDow" message to webworker
        //shield.moveDown();
        //game.players.shieldMoveDown(side, shield.region.y);
        //player.shieldMovedDown(side, shield.region.y, key)
    });
    player.on(Player.events.STOP, function(key) {
        //TODO: post "shieldStop" message to webworker
        //shield.stop();
        //game.players.shieldStop(side, shield.region.y);
        //player.shieldStoped(side, shield.region.y, key)
    });

    game.active[side] = player;
    game.updateGameState();
};

Game.prototype.updateGameState = function() {
    if (this.active.left && this.active.right) {
        this.gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
        //TODO: post "startRound" message to webworker
        this.startSnapshotter();
        //this.startRound();
    } else if (this.gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
        this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        //TODO: post "pause" message to webworker
        this.stopSnapshotter();
        //this.pause();
    }

    this.players.gameState(this.getState());
};

Game.prototype.getState = function() {
    var c = comps.Constants;

    return {
        game: this.gameState,
        players: {
            'left': this.active.left ? c.PLAYER_STATE_CONNECTED : c.PLAYER_STATE_FREE,
            'right': this.active.right ? c.PLAYER_STATE_CONNECTED : c.PLAYER_STATE_FREE
        }
    };
};

/*Game.prototype.startRound = function() {
    var that = this;
    that.webworkerGame.ball.preparePitch();

    that.players.roundStarted({
        shields: {
            left: that.webworkerGame.shields.left.serialize(),
            right: that.webworkerGame.shields.right.serialize()
        },
        ball: that.webworkerGame.ball.serialize(),
        countdown: pong.Globals.COUNTDOWN
    });

    setTimeout(function() {
        that.webworkerGame.ball.pitch();
    }, pong.Globals.COUNTDOWN * 1000);

    that.webworkerGame.stage.start();
};

Game.prototype.pause = function() {
    this.webworkerGame.stage.stop();
};

Game.prototype.restartRound = function() {
    this.pause();
    this.startRound();
};

Game.prototype.canBeFinished = function() {
    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            return true;
        }
    }

    return false;
};

Game.prototype.getWinner = function() {
    var winner = null;

    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            winner = key;
            break;
        }
    }
    
    return winner;
};*/

Game.prototype.startSnapshotter = function() {return;
    /*TODO: subscribe to "element changed" event from webworker
    store changed elements in internal "state"
    send internal "state" within snapshot packets by interval*/

    /*var that = this;
    
    this.snapshotter = setInterval(function(elements) {
        that.players.gameSnapshot(that.webworkerGame.stage.serialize());
    }, 1000 / pong.Globals.SPS);*/
};

Game.prototype.stopSnapshotter = function() {
    clearInterval(this.snapshotter);
};

/*Game.prototype.finish = function() {
    this.pause();
    this.players.gameFinished({
        winner: this.getWinner()
    });
}

Game.prototype.reset = function() {
    this.webworkerGame.shields.left.region.y = 250;
    this.webworkerGame.shields.right.region.y = 250;
    this.scores.left = 0;
    this.scores.right = 0;
};*/