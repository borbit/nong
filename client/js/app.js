$(function() {
    var packets = Pong.Packets;
    var transport = Pong.Transports.WS();
    var game = new Game(transport);

    var menu = $('#menu');
    var statusMessage = $('#menu .status');
    var joinButtons = {left: $('#menu .button.left'), right: $('#menu .button.right')};
    var waitingMessages = {left: $('#menu .waiting.left'), right: $('#menu .waiting.right')};
    var joinedMessages = {left: $('#menu .joined.left'), right: $('#menu .joined.right')};
    
    joinButtons.left.click(function() {game.joinLeft();});
    joinButtons.right.click(function() {game.joinRight();});

    transport.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
        game.joinGame('only');
        statusMessage.hide();
        joinButtons.left.show();
        joinButtons.right.show();
    });

    transport.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
        menu.show();
        joinButtons.left.hide();
        joinButtons.right.hide();
        joinedMessages.left.hide();
        joinedMessages.right.hide();
        statusMessage.text('DISCONNECTED').show();
    });

    transport.subscribe(packets.GameState.id, function(state) {
        var c = Components.Constants;

        for (var key in state.players) {
            if (state.players[key] == c.PLAYER_STATE_CONNECTED) {
                joinButtons[key].hide();
                waitingMessages[key].hide();
                joinedMessages[key].show();
            } else {
                joinButtons[key].show();
                waitingMessages[key].hide();
                joinedMessages[key].hide();
            }
        }

        if(state.game == c.GAME_STATE_IN_PROGRESS) {
            joinedMessages.left.hide();
            joinedMessages.right.hide();
            menu.hide();
        } else {
            menu.show();
        }
    });

    transport.subscribe(packets.GameFinished.id, function(data) {
        menu.show();
        if (data.winner == game.player.shield.id) {
            statusMessage.text("YOU WON").show();
        }
        else {
            statusMessage.text("YOU LOST").show();
        }
    });

    var view = Pong.View(game.stage);
    var ballRenderer = Pong.Renderers.Ball();
    var shieldRenderer = Pong.Renderers.Shield();
    view.addRenderer(game.shields.left.id, $('#shield1'), shieldRenderer);
    view.addRenderer(game.shields.right.id, $('#shield2'), shieldRenderer);
    view.addRenderer(game.ball.id, $('#ball'), ballRenderer);

    statusMessage.text('CONNECTING').show();
    transport.connect();
});