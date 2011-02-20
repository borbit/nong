function Game(transport) {
    Game.superproto.constructor.call(this);
    this.ball.client = true;

    this.player = new Pong.LocalPlayer(transport);
    this.opponent = false;
    this.dynamics.addElement(this.ball);

    var that = this;

    transport.subscribe(Pong.Packets.RoundStarted.id, function(data) {
        that.ball.setState(data.ball);

        for(var side in data.shields) {
            that.updateShieldState(side, data.shields[side]);
        }

        setTimeout(function() {
            that.ball.pitch();
        }, data.countdown * 1000);
    });

    transport.subscribe(Pong.Packets.ScoresChanged.id, function(data) {
        that.updateScores(data.scores);
    });
    
    transport.subscribe(Pong.Packets.GameSnapshot.id, function(data) {
        that.dynamics.pushSnapshot(data);
    });

    transport.subscribe(Pong.Packets.GameState.id, function(state) {
        var c = Components.Constants;
        
        for (var key in state.players) {
            if (state.players[key] == c.PLAYER_STATE_CONNECTED) {
                if (!that.opponent && (!that.player.shield || that.player.shield.id != key)) {
                    that.dynamics.addElement(that.shields[key]);
                    that.opponent = true;
                }
            }
        }

        if(state.game == c.GAME_STATE_IN_PROGRESS) {
            that.stage.start();
            that.dynamics.start();
        } else {
            that.stage.stop();
            that.dynamics.stop();
        }
    });
}

Utils.inherit(Game, Pong.Game);

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
