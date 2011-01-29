$(function() {
    var ws = Pong.ClientWSAdapter(),
        publisher = Pong.RemoteEventsPublisher(ws),
        receiver = Pong.RemoteEventsReceiver(ws),

        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');
    
    joinButtonLeft.click(function() {
        publisher.joinLeft();
    });

    joinButtonRight.click(function() {
        publisher.joinRight();
    });
    
    ws.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        publisher.joinGame('only');
        statusMessage.hide();
        joinButtonLeft.show();
        joinButtonRight.show();
    });

    ws.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        menu.show();
        joinButtonLeft.hide();
        joinButtonRight.hide();
        waitingMessage.hide();
        joinedMessage.hide(); 
        statusMessage.text('DISCONNECTED').show();
    });
    
    receiver.subscribe(receiver.events.GAMESTATE, function(packetData) {
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
            createGame();
        }
    });

    receiver.subscribe(receiver.events.GAMESNAPSHOT, function(packetData) {
        shieldLeft.region.x = packetData['left'].x;
        shieldLeft.region.y = packetData['left'].y;
        shieldRight.region.x = packetData['right'].x;
        shieldRight.region.y = packetData['right'].y;
        ball.region.x = packetData['ball'].x;
        ball.region.y = packetData['ball'].y;
    });
    
    statusMessage.text('CONNECTING').show();
    ws.connect();

    var shieldLeft, shieldRight, ball;
    
    function createGame() {

        Pong.ClientEvents.subscribe(Pong.ClientEvents.events.MOVEUP, function() {
            publisher.shieldMoveUp('left');
            publisher.shieldMoveUp('right');
        });

        Pong.ClientEvents.subscribe(Pong.ClientEvents.events.MOVEDOWN, function() {
            publisher.shieldMoveDown('left');
            publisher.shieldMoveDown('right');
        });

        Pong.ClientEvents.subscribe(Pong.ClientEvents.events.STOP, function() {
            publisher.shieldStop('left');
            publisher.shieldStop('right');
        });

        ball = new Pong.Ball(100, 100, 'ball');

        var stage = Pong.NongStage();

        shieldLeft = new Pong.Shield(40, 250, 'left');
        shieldRight = new Pong.Shield(750, 250, 'right');
        
        stage.addDynamicElement(shieldLeft)
            .addDynamicElement(shieldRight)
            .addDynamicElement(ball)
            .start();

        var view = Pong.View(stage);
        var ballsRenderer = Pong.Renderers.Ball();
        var shieldsRenderer = Pong.Renderers.Shield();
        view.addRenderer(shieldLeft.id, $('#shield1'), shieldsRenderer);
        view.addRenderer(shieldRight.id, $('#shield2'), shieldsRenderer);
        view.addRenderer(ball.id, $('#ball'), ballsRenderer);
    }
});