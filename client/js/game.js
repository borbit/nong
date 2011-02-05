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
        assignShield('left');
    });

    joinButtonRight.click(function() {
        remotePublisher.joinRight();
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

    remoteReceiver.subscribe(remoteReceiver.events.GAMESNAPSHOT, function(data) {
        shields.left.region.x = data[shields.left.id].x;
        shields.left.region.y = data[shields.left.id].y;
        shields.right.region.x = data[shields.right.id].x;
        shields.right.region.y = data[shields.right.id].y;
        ball.region.x = data[ball.id].x;
        ball.region.y = data[ball.id].y;
        ball.kx = data[ball.id].kx;
        ball.ky = data[ball.id].ky;
        ball.angle = data[ball.id].angle;
        ball.isMoving = data[ball.id].isMoving;
    });

    remoteReceiver.subscribe(remoteReceiver.events.MOVEUP, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].energy = data.energy;
        shields[data.side].moveUp();
    });
    remoteReceiver.subscribe(remoteReceiver.events.MOVEDOWN, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].energy = data.energy;
        shields[data.side].moveDown();
    });
    remoteReceiver.subscribe(remoteReceiver.events.STOP, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].stop();
        console.log("STOP");
    });

    statusMessage.text('CONNECTING').show();
    transport.connect();

    function assignShield(side) {
        var keyboard = Pong.EventsClient.KeyboardReceiver;

        keyboard.subscribe(keyboard.events.MOVEUP, function() {
            remotePublisher.shieldMoveUp(side);
            shields[side].moveUp();
        });
        keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
            remotePublisher.shieldMoveDown(side);
            shields[side].moveDown();
        });
        keyboard.subscribe(keyboard.events.STOP, function() {
            remotePublisher.shieldStop(side);
            shields[side].stop();
        });
    }

    var shields = {
        left: new Pong.Shield(40, 250, 'left'),
        right: new Pong.Shield(750, 250, 'right')
    };
    var goals = {
        left: new Pong.Goal(-50, 0, 600),
        right: new Pong.Goal(800, 0, 600)
    };
    var ball = new Pong.Ball(100, 100, 'ball');
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

    //TODO: this should be a method of a shared Game object
    function startRound() {
        //TODO: implement pause and countdown
        setTimeout(function() {
            ball.pitch();
        }, 2000);
    }

    startRound();
        
    stage.subscribe(Pong.Stage.events.goalHit, function(goal) {
        startRound();
    });
});