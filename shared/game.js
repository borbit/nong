(function(ns) {

var pong = require('./pong');
var latency = require('./latency');

ns.Game = function() {
    this.scores = {left: 0, right: 0};
    this.shields = {
        left: new pong.Shield(40, 0, 'left'),
        right: new pong.Shield(750, 0, 'right')
    };
    this.goals = {
        left: new pong.Goal(-50, 0, 600),
        right: new pong.Goal(800, 0, 600)
    };
    
    this.ball = new pong.Ball('ball');
    this.dynamics = new latency.Dynamics();
    this.stage = pong.Stage(this.dynamics);


    this.stage.addStaticElement(new pong.StageWall(0, -50, 800))
              .addStaticElement(new pong.StageWall(0, 600, 800))
              .addStaticElement(this.goals.left)
              .addStaticElement(this.goals.right)
              .addDynamicElement(this.shields.left)
              .addDynamicElement(this.shields.right)
              .addDynamicElement(this.ball);

    var game = this;

    this.stage.subscribe(ns.Stage.events.goalHit, function(goal) {
        for (var key in game.goals) {
            if (game.goals[key] == goal) {
                game.scores[key] += 1;

                //TODO: fire scores changed webworker event
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
    });
};


ns.Game.prototype.startRound = function() {
    var that = this;
    that.ball.preparePitch();

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

    that.stage.start();
};

ns.Game.prototype.pause = function() {
    this.stage.stop();
    //clearInterval(this.snapshotter);
};

ns.Game.prototype.restartRound = function() {
    this.pause();
    this.startRound();
};

ns.Game.prototype.canBeFinished = function() {
    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            return true;
        }
    }

    return false;
};

ns.Game.prototype.getWinner = function() {
    var winner = null;

    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            winner = key;
            break;
        }
    }

    return winner;
};

ns.Game.prototype.finish = function() {
    this.pause();
    //TODO: fire webworker event: gameFinished
    /*this.players.gameFinished({
        winner: this.getWinner()
    });*/
}

ns.Game.prototype.reset = function() {
    this.shields.left.region.y = 250;
    this.shields.right.region.y = 250;
    this.scores.left = 0;
    this.scores.right = 0;
};

}((typeof exports === 'undefined') ? window.Pong : exports));