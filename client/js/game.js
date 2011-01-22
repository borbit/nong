$(function() {
    var ws = Pong.ClientWSAdapter(),
        publisher = Pong.RemoutEventsPublisher(ws),
        receiver = Pong.RemoutEventsReceiver(ws),
        
        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined');
    
    joinButtonLeft.click(publisher.joinLeft);
    joinButtonRight.click(publisher.joinRight);
    
    ws.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        joinButtonLeft.show();
        joinButtonRight.show();
    });

    ws.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        
    });
    
    receiver.subscribe(Pong.RemoutEventsReceiver.events.GAMESTATE, function(packetData) {
        if (packetData.gameState == Pong.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
            if (packetData.leftPlayerState == Pong.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonLeft.hide();
                joinedMessage.addClass('left').show();
            }
            if (packetData.rightPlayerState == Pong.Constants.PLAYER_STATE_CONNECTED) {
                joinButtonRight.hide();
                joinedMessage.addClass('right').show();
            }
        } else if(packetData.gameState == Pong.Constants.GAME_STATE_IN_PROGRESS) {
            createGame();
        }
    });
    
    ws.connect();
    
    function createGame() {
        var shield1 = Pong.Shield(40, 250);
        var shield2 = Pong.Shield(750, 250);
        var ball = Pong.Ball(100, 100);

        var stage = Pong.Stage();
        stage.addShield(shield1, Pong.ClientEvents);
        stage.addShield(shield2, Pong.ClientEvents);
        stage.addBall(ball);
        stage.start();

        var view = Pong.View(stage);
        var ballsRenderer = Pong.Renderers.Ball();
        var shieldsRenderer = Pong.Renderers.Shield();
        view.addRenderer(shield1.id, $('#shield1'), shieldsRenderer);
        view.addRenderer(shield2.id, $('#shield2'), shieldsRenderer);
        view.addRenderer(ball.id, $('#ball'), ballsRenderer);
    }
});