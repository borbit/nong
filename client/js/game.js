$(function() {
    var transport = Pong.Transports.WS(),
        player = Pong.Player(transport),

        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        scores = {
            'left': $('#score-left'),
            'right': $('#score-right')
        },
        menu = $('#menu');

    joinButtonLeft.click(function() {
        player.joinLeft();
        player.ping();
        assignShield('left');
    });

    joinButtonRight.click(function() {
        player.joinRight();
        player.ping();
        assignShield('right');
    });
    
    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        player.joinGame('only');
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

    player.subscribe(player.events.GAMESTATE, function(state) {
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
            stage.start();
        }
    });

    player.subscribe(player.events.ROUNDSTARTED, function(data) {
        updateBallState(data.ball);
        updateScores(data.scores);
        
        setTimeout(function() {
            ball.pitch();
        }, data.countdown * 1000);
    });

    player.subscribe(player.events.GAMESNAPSHOT, function(data) {
        updateBallState(data[ball.id]);
    });

    player.subscribe(player.events.MOVEUP, function(data) {
        shields[data.side].region.y = data.y;
        shields[data.side].moveUp();
    });
    player.subscribe(player.events.MOVEDOWN, function(data) {
        shields[data.side].region.y = data.y;
        shields[data.side].moveDown();
    });
    player.subscribe(player.events.STOP, function(data) {
        shields[data.side].region.y = data.y;
        shields[data.side].stop();
    });

    statusMessage.text('CONNECTING').show();
    transport.connect();

    function updateBallState(data) {
        ball.region.x = data.x;
        ball.region.y = data.y;
        ball.kx = data.kx;
        ball.ky = data.ky;
        ball.angle = data.angle;
        ball.isMoving = data.isMoving;
    }

    function updateScores(scoresData) {
        for (var key in scoresData) {
            scores[key].html(scoresData[key]);
        }
    }

    function assignShield(side) {
        var keyboard = Pong.EventsClient.KeyboardReceiver;

        keyboard.subscribe(keyboard.events.MOVEUP, function() {
            player.shieldMoveUp(side, shields[side].region.y);
            shields[side].moveUp();
        });
        keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
            player.shieldMoveDown(side, shields[side].region.y);
            shields[side].moveDown();
        });
        keyboard.subscribe(keyboard.events.STOP, function() {
            player.shieldStop(side, shields[side].region.y);
            shields[side].stop();
        });
    }

    var shields = {
        left: new Pong.Shield(40, 20, 'left'),
        right: new Pong.Shield(750, 20, 'right')
    };
    var goals = {
        left: new Pong.Goal(-50, 0, 600),
        right: new Pong.Goal(800, 0, 600)
    };
    var ball = new Pong.Ball('ball');
    var stage = Pong.Stage();

    stage.addStaticElement(new Pong.StageWall(0, -50, 800))
         .addStaticElement(new Pong.StageWall(0, 600, 800))
         .addStaticElement(goals.left)
         .addStaticElement(goals.right)
         .addShield(shields.left)
         .addShield(shields.right)
         .addDynamicElement(ball);

    var view = Pong.View(stage);
    var ballRenderer = Pong.Renderers.Ball();
    var shieldRenderer = Pong.Renderers.Shield();
    view.addRenderer(shields.left.id, $('#shield1'), shieldRenderer);
    view.addRenderer(shields.right.id, $('#shield2'), shieldRenderer);
    view.addRenderer(ball.id, $('#ball'), ballRenderer);
});