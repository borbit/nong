$(function() {
    var transport = Pong.EventsRemote.Adapters.WS(),
        publisher = Pong.EventsRemote.Publisher(transport),
        receiver = Pong.EventsRemote.Receiver(transport),

        joinButtonLeft = $('#menu .button.left'),
        joinButtonRight = $('#menu .button.right'),
        waitingMessage = $('#menu .waiting'),
        joinedMessage = $('#menu .joined'),
        statusMessage = $('#menu .status'),
        menu = $('#menu');

    joinButtonLeft.click(function() {
        publisher.joinLeft();
        chosenSide = 'left';
    });

    joinButtonRight.click(function() {
        publisher.joinRight();
        chosenSide = 'right';
    });
    
    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        publisher.joinGame('only');
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

    receiver.subscribe(receiver.events.GAMESNAPSHOT, function(data) {
        /*shields.left.region.x = data['left'].x;
        shields.left.region.y = data['left'].y;
        shields.right.region.x = data['right'].x;
        shields.right.region.y = data['right'].y;*/
        ball.region.x = data['ball'].x;
        ball.region.y = data['ball'].y;
        ball.kx = data['ball'].kx;
        ball.ky = data['ball'].ky;
        ball.angle = data['ball'].angle;
        ball.isMoving = data['ball'].isMoving;
    });

    receiver.subscribe(receiver.events.MOVEUP, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].energy = data.energy;
        shields[data.side].moveUp();
    });
    receiver.subscribe(receiver.events.MOVEDOWN, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].energy = data.energy;
        shields[data.side].moveDown();
    });
    receiver.subscribe(receiver.events.STOP, function(data) {
        shields[data.side].region.x = data.x;
        shields[data.side].region.y = data.y;
        shields[data.side].stop();
        console.log("STOP");
    });

    statusMessage.text('CONNECTING').show();
    transport.connect();

    var shields = {left: null, right: null} , ball, chosenSide;
    var goals = {left: null, right: null};
    var keyboard = Pong.EventsClient.KeyboardReceiver;

    function createGame() {
        keyboard.subscribe(keyboard.events.MOVEUP, function() {
            publisher.shieldMoveUp(chosenSide);
        });
        keyboard.subscribe(keyboard.events.MOVEDOWN, function() {
            publisher.shieldMoveDown(chosenSide);
        });
        keyboard.subscribe(keyboard.events.STOP, function() {
            publisher.shieldStop(chosenSide);
        });

        ball = new Pong.Ball('ball');

        var stage = Pong.Stage();

        shields.left = new Pong.Shield(40, 250, 'left');
        shields.right = new Pong.Shield(750, 250, 'right');

        goals.left = new Pong.Goal(-50, 0, 600);
        goals.right = new Pong.Goal(800, 0, 600);

        stage.addStaticElement(new Pong.StageWall(0, -50, 800))
             .addStaticElement(new Pong.StageWall(0, 600, 800))
             .addStaticElement(goals.left)
             .addStaticElement(goals.right)
             .addShield(shields.left)
             .addShield(shields.right)
             .addDynamicElement(ball)
             .start();

        //TODO: this should be a method of a shared Game object
        function startRound() {
            //TODO: implement pause and countdown
            setTimeout(function() {
                ball.pitch();
            }, 2000);
        }

        //startRound();
        
        stage.subscribe(Pong.Stage.events.goalHit, function(goal) {
            startRound();
        });

        var view = Pong.View(stage);
        var ballsRenderer = Pong.Renderers.Ball();
        var shieldsRenderer = Pong.Renderers.Shield();
        view.addRenderer(shields.left.id, $('#shield1'), shieldsRenderer);
        view.addRenderer(shields.right.id, $('#shield2'), shieldsRenderer);
        view.addRenderer(ball.id, $('#ball'), ballsRenderer);
    }
});