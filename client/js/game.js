$(function() {

function Game() {

    Game.superproto.constructor.call(this);

    var that = this; console.log(that);
    var transport = Pong.Transports.WS(),
        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');

    this.player = Pong.Player(transport);

    joinButtonLeft.click(function() {
        that.player.joinLeft();
        that.player.ping();
        that.assignShield('left');
    });

    joinButtonRight.click(function() {
        that.player.joinRight();
        that.player.ping();
        that.assignShield('right');
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

    this.player.subscribe(this.player.events.GAMESTATE, function(state) {
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

    this.player.subscribe(this.player.events.ROUNDSTARTED, function(data) {
        that.updateBallState(data.ball);
        
        setTimeout(function() {
            that.ball.pitch();
        }, data.countdown * 1000);
    });
    this.player.subscribe(this.player.events.GAMESNAPSHOT, function(data) {
        that.updateBallState(data[that.ball.id]);
    });
    this.player.subscribe(this.player.events.MOVEUP, function(data) {
        that.shields[data.side].region.y = data.y;
        that.shields[data.side].moveUp();
    });
    this.player.subscribe(this.player.events.MOVEDOWN, function(data) {
        that.shields[data.side].region.y = data.y;
        that.shields[data.side].moveDown();
    });
    this.player.subscribe(this.player.events.STOP, function(data) {
        that.shields[data.side].region.y = data.y;
        that.shields[data.side].stop();
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
        var keyboard = Pong.EventsClient.KeyboardReceiver;

        keyboard.subscribe(keyboard.events.MOVEUP, function() {
            that.player.shieldMoveUp(side, that.shields[side].region.y);
        });
        keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
            that.player.shieldMoveDown(side, that.shields[side].region.y);
        });
        keyboard.subscribe(keyboard.events.STOP, function() {
            that.player.shieldStop(side, that.shields[side].region.y);
        });
    }
});

var game = new Game();

});