var pong = require('./pong');
var latency = require('./latency');

WebworkerGame = function() {
    this.game = new pong.Game();
    this.scores = {left: 0, right: 0};
    
    var that = this;

    this.stage.subscribe(ns.Stage.events.goalHit, function(goal) {
        for (var key in that.game.goals) {
            if (that.game.goals[key] == goal) {
                that.scores[key] += 1;

                //TODO: fire scores changed webworker event
                /*that.players.scoresChanged({
                    scores: that.scores
                });*/
            }
        }

        if (that.canBeFinished()) {
            that.finish();
        }
        else {
            that.restartRound();
        }
    });
};


WebworkerGame.prototype.startRound = function() {
    this.game.ball.preparePitch();

    //TODO: fire webworker event: round started
    /*that.players.roundStarted({
        shields: {
            left: that.shields.left.serialize(),
            right: that.shields.right.serialize()
        },
        ball: that.ball.serialize(),
        countdown: pong.Globals.COUNTDOWN
    });

    setTimeout(function() {
        that.ball.pitch();

        that.snapshotter = setInterval(function(elements) {
            that.players.gameSnapshot(that.stage.serialize());
        }, 1000 / pong.Globals.SPS);

    }, pong.Globals.COUNTDOWN * 1000);*/

    this.game.stage.start();
};

WebworkerGame.prototype.pause = function() {
    this.game.stage.stop();
    //clearInterval(this.snapshotter);
};

WebworkerGame.prototype.restartRound = function() {
    this.game.pause();
    this.game.startRound();
};

WebworkerGame.prototype.canBeFinished = function() {
    for (var key in this.scores) {
        if (this.scores[key] >= pong.Globals.ROUNDS_TO_WIN) {
            return true;
        }
    }

    return false;
};

WebworkerGame.prototype.getWinner = function() {
    var winner = null;

    for (var key in this.scores) {
        if (this.scores[key] >= pong.Globals.ROUNDS_TO_WIN) {
            winner = key;
            break;
        }
    }

    return winner;
};

WebworkerGame.prototype.finish = function() {
    this.pause();
    //TODO: fire webworker event: gameFinished
    /*this.players.gameFinished({
        winner: this.getWinner()
    });*/
}

WebworkerGame.prototype.reset = function() {
    this.game.shields.left.region.y = 250;
    this.game.shields.right.region.y = 250;
    this.scores.left = 0;
    this.scores.right = 0;
};

module.exports = WebworkerGame;