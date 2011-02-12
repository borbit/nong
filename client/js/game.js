$(function() {

function Game() {

    Game.superproto.constructor.call(this);

    var that = this;
    var packets = Pong.Packets;
    var transport = Pong.Transports.WS()
    this.player = Pong.Player(transport);
    this.opponent = Pong.Opponent(transport);
    
    var joinButtons = {left: $('#menu .button.left'), right: $('#menu .button.right')};
    var waiting = {left: $('#menu .waiting.left'), right: $('#menu .waiting.right')};
    var joined = {left: $('#menu .joined.left'), right: $('#menu .joined.right')};
    
    var status = $('#menu .status');
    var menu = $('#menu');

    joinButtons.left.click(function() {
        that.player.joinLeft();
        that.player.assignShield(that.shields.left);
    });

    joinButtons.right.click(function() {
        that.player.joinRight();
        that.player.assignShield(that.shields.right);
    });
    
    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        that.player.joinGame('only');
        status.hide();
        joinButtons.left.show();
        joinButtons.right.show();
    });

    transport.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        menu.show();
        joinButtons.left.hide();
        joinButtons.right.hide();
        joined.left.hide();
        joined.right.hide();
        
        status.text('DISCONNECTED').show();
    });

    transport.subscribe(packets.GameState.id, function(state) {
        for (var key in state.players) {
            if (state.players[key] == Components.Constants.PLAYER_STATE_CONNECTED) {
                joinButtons[key].hide();
                joined[key].show();
                if (!that.opponent.shield && (!that.player.shield || that.player.shield.id != key)) {
                    that.opponent.assignShield(that.shields[key]);
                }
            } else {
                joinButtons[key].show();
                joined[key].hide();
            }
        }
        
        if(state.game == Components.Constants.GAME_STATE_IN_PROGRESS) {
            menu.hide();
            that.stage.start();
        }

        if(state.game == Components.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
            menu.show();
            that.stage.stop();
        }
    });

    transport.subscribe(packets.RoundStarted.id, function(data) {
        that.updateBallState(data.ball);
        that.updateScores(data.scores);
        
        setTimeout(function() {
            that.ball.pitch();
        }, data.countdown * 1000);
    });
    
    transport.subscribe(packets.GameSnapshot.id, function(data) {
        that.updateBallState(data[that.ball.id]);
    });

    status.text('CONNECTING').show();
    transport.connect();

    var view = Pong.View(that.stage);
    var ballRenderer = Pong.Renderers.Ball();
    var shieldRenderer = Pong.Renderers.Shield();
    view.addRenderer(this.shields.left.id, $('#shield1'), shieldRenderer);
    view.addRenderer(this.shields.right.id, $('#shield2'), shieldRenderer);
    view.addRenderer(this.ball.id, $('#ball'), ballRenderer);
};

Utils.inherit(Game, Pong.Game);

Game.prototype.updateBallState = function(data) {
    this.ball.region.x = data.x;
    this.ball.region.y = data.y;
    this.ball.kx = data.kx;
    this.ball.ky = data.ky;
    this.ball.angle = data.angle;
    this.ball.isMoving = data.isMoving;
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

new Game();

});