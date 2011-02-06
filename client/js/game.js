$(function() {
    var transport = Pong.EventsRemote.Adapters.WS(),
        remotePublisher = Pong.EventsRemote.Publisher(transport),
        remoteReceiver = Pong.EventsRemote.Receiver(transport),

        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');

    joinButtonLeft.click(function() {
        remotePublisher.joinLeft();
        remotePublisher.ping();
        assignShield('left');
    });

    joinButtonRight.click(function() {
        remotePublisher.joinRight();
        remotePublisher.ping();
        assignShield('right');
    });
    
    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        remotePublisher.joinGame('only');
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

    remoteReceiver.subscribe(remoteReceiver.events.GAMESTATE, function(packetData) {
        if (packetData.gameState == Components.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
            if (packetData.leftPlayerState == Components.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonLeft.hide();
                joinedMessage.addClass('left').show();
            }
            if (packetData.rightPlayerState == Components.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonRight.hide();
                joinedMessage.addClass('right').show();
            }
        } else if(packetData.gameState == Components.Constants.GAME_STATE_IN_PROGRESS) {
            menu.hide();
            stage.start();
        }
    });

    remoteReceiver.subscribe(remoteReceiver.events.ROUNDSTARTED, function(data) {
        updateBallState(data.ball);
        
        setTimeout(function() {
            ball.pitch();
        }, data.countdown * 1000 - remotePublisher.latency);
    });

    remoteReceiver.subscribe(remoteReceiver.events.GAMESNAPSHOT, function(data) {
        if(ball.kx != data.ball.kx || ball.ky != data.ball.ky) {
            return;
        }
        updateBallState(data[ball.id]);
        ball.updatePosition(remotePublisher.latency);
    });

    remoteReceiver.subscribe(remoteReceiver.events.MOVEUP, function(data) {
        if(chosenSide == data.side) { return; }
        shields[data.side].region.y = data.y;
        shields[data.side].moveUp();
    });
    remoteReceiver.subscribe(remoteReceiver.events.MOVEDOWN, function(data) {
        if(chosenSide == data.side) { return; }
        shields[data.side].region.y = data.y;
        shields[data.side].moveDown();
    });
    remoteReceiver.subscribe(remoteReceiver.events.STOP, function(data) {
        if(chosenSide == data.side) { return; }
        shields[data.side].region.y = data.y;
        shields[data.side].stop();
    });

    remoteReceiver.subscribe(remoteReceiver.events.MOVEDUP, function(data) {
        correctShieldPosition(data.key, data.y, data.side);
    });
    remoteReceiver.subscribe(remoteReceiver.events.MOVEDDOWN, function(data) {
        correctShieldPosition(data.key, data.y, data.side);
    });
    remoteReceiver.subscribe(remoteReceiver.events.STOPED, function(data) {
        correctShieldPosition(data.key, data.y, data.side);
    });

    function correctShieldPosition(key, correctY, side) {
        var move = remotePublisher.moves[key];
        if(move && move == correctY) {
            return;
        }

        var delta = correctY - remotePublisher.moves[key];
        remotePublisher.moves[key++] = correctY;

        for(; key < remotePublisher.moves.length; key++) {
            remotePublisher.moves[key] += delta;
        }

        shields[side].region.y = remotePublisher.moves[key-1];
    }

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

    function assignShield(side) {
        var keyboard = Pong.EventsClient.KeyboardReceiver;

        keyboard.subscribe(keyboard.events.MOVEUP, function() {
            remotePublisher.shieldMoveUp(side, shields[side].region.y);
            shields[side].moveUp();
        });
        keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
            remotePublisher.shieldMoveDown(side, shields[side].region.y);
            shields[side].moveDown();
        });
        keyboard.subscribe(keyboard.events.STOP, function() {
            remotePublisher.shieldStop(side, shields[side].region.y);
            shields[side].stop();
        });

        chosenSide = side;
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
    var chosenSide = null;

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