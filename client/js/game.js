$(function() {

function Game() {

    Game.superproto.constructor.call(this);

    var that = this;
    var packets = Pong.Packets;
    var transport = Pong.Transports.WS(),
        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');

    this.player = Pong.Player(transport);
    this.oponent = Pong.Player(transport);

    joinButtonLeft.click(function() {
        that.player.joinLeft();
        that.assignShield(that.shields.left);
    });

    joinButtonRight.click(function() {
        that.player.joinRight();
        that.assignShield(that.shields.right);
    });
    
    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        that.player.joinGame('only');
        statusMessage.hide();
        joinButtonLeft.show();
        joinButtonRight.show();
    });

    transport.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        menu.show();
        joinButtonLeft.hide();
        joinButtonRight.hide();
        waitingMessage.hide();
        joinedMessage.hide();
        statusMessage.text('DISCONNECTED').show();
    });

    transport.subscribe(packets.GameState.id, function(state) {
        if (state.game == Components.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
            if (state.leftPlayer == Components.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonLeft.hide();
                joinedMessage.addClass('left').show();
            }
            if (state.rightPlayer == Components.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonRight.hide();
                joinedMessage.addClass('right').show();
            }
        } else if(state.game == Components.Constants.GAME_STATE_IN_PROGRESS) {
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

    assignShield: function(side) {
        var that = this;
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