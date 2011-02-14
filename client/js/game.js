function Game(transport) {
    Game.superproto.constructor.call(this);

    this.player = new Pong.LocalPlayer(transport);
    this.opponent = new Pong.Opponent(transport);

    var that = this;

    transport.subscribe(Pong.Packets.RoundStarted.id, function(data) {
        that.updateBallState(data.ball);
        that.updateScores(data.scores);

        for(var side in data.shields) {
            that.updateShieldState(side, data.shields[side]);
        }
        
        setTimeout(function() {
            that.ball.pitch();
        }, data.countdown * 1000);
    });
    
    transport.subscribe(Pong.Packets.GameSnapshot.id, function(data) {
        that.updateBallState(data[that.ball.id]);
    });

    transport.subscribe(Pong.Packets.GameState.id, function(state) {
        var c = Components.Constants;
        
        for (var key in state.players) {
            if (state.players[key] == c.PLAYER_STATE_CONNECTED) {
                if (!that.opponent.shield && (!that.player.shield || that.player.shield.id != key)) {
                    that.opponent.assignShield(that.shields[key]);
                }
            }
        }

        if(state.game == c.GAME_STATE_IN_PROGRESS) {
            that.stage.start();
        } else {
            that.stage.stop();
        }
    });
}

Utils.inherit(Game, Pong.Game);

Game.prototype.updateBallState = function(data) {
    this.ball.region.x = data.x;
    this.ball.region.y = data.y;
    this.ball.kx = data.kx;
    this.ball.ky = data.ky;
    this.ball.angle = data.angle;
    this.ball.isMoving = data.isMoving;
};

Game.prototype.updateShieldState = function(side, data) {
    this.shields[side].region.y = data.y;
};

Game.prototype.updateScores = function(scoresData) {
    var scores = {
        'left': $('#score-left'),
        'right': $('#score-right')
    };

    for (var key in scoresData) {
        scores[key].html(scoresData[key]);
    }
};

Game.prototype.joinLeft = function() {
    this.player.joinLeft();
    this.player.assignShield(this.shields.left);
};

Game.prototype.joinRight = function() {
    this.player.joinRight();
    this.player.assignShield(this.shields.right);
};

Game.prototype.joinGame = function(gameName) {
    this.player.joinGame(gameName);
};