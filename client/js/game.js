$(function() {

function Game() {

    Game.superproto.constructor.call(this);

    var that = this;
    var packets = Pong.Packets;
    var transport = Pong.Transports.WS(),
        joinButtons = {
            'left': $('#menu .button.left'),
            'right': $('#menu .button.right')
        },
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');

    this.player = Pong.Player(transport);
    this.opponent = Pong.Opponent(transport);

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
        statusMessage.hide();
        joinButtons.left.show();
        joinButtons.right.show();
    });

    transport.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        menu.show();
        joinButtons.left.hide();
        joinButtons.right.hide();
        waitingMessage.hide();
        joinedMessage.hide();
        statusMessage.text('DISCONNECTED').show();
    });

    transport.subscribe(packets.OpponentConnected.id, function(data) {
        that.opponent.assignShield(that.shields[data.side]);
    });

    transport.subscribe(packets.GameState.id, function(state) {
        if (state.game == Components.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
            for (var key in state.players) {
                if (state.players[key] == Components.Constants.PLAYER_STATE_CONNECTED) {
                    joinButtons[key].hide();
                    joinedMessage.addClass(key).show();
                }
            }
        }
        else if(state.game == Components.Constants.GAME_STATE_IN_PROGRESS) {
            menu.hide();
            that.stage.start();
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

    statusMessage.text('CONNECTING').show();
    transport.connect();

    var view = Pong.View(that.stage);
    var ballRenderer = Pong.Renderers.Ball();
    var shieldRenderer = Pong.Renderers.Shield();
    view.addRenderer(this.shields.left.id, $('#shield1'), shieldRenderer);
    view.addRenderer(this.shields.right.id, $('#shield2'), shieldRenderer);
    view.addRenderer(this.ball.id, $('#ball'), ballRenderer);
};

Utils.inherit(Game, Pong.Game);

Utils._.extend(Game.prototype, {
    updateBallState: function(data) {
        this.ball.region.x = data.x;
        this.ball.region.y = data.y;
        this.ball.kx = data.kx;
        this.ball.ky = data.ky;
        this.ball.angle = data.angle;
        this.ball.isMoving = data.isMoving;
    },

    updateScores: function(scoresData) {
        var scores = {
            'left': $('#score-left'),
            'right': $('#score-right')
        };

        for (var key in scoresData) {
            scores[key].html(scoresData[key]);
        }
    }
});

var game = new Game();

});