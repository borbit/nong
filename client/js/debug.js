$(function() {
    $('#connect').bind('click', ws.connect);
    $('#disconnect').bind('click', ws.disconnect);
    $('#join-left').bind('click', remout.joinLeft);
    $('#join-right').bind('click', remout.joinRight);
    console.log('Initialization complete');
});

var ws = Pong.ClientWSAdapter();
var remout = Pong.RemoutEventsPublisher(ws);

ws.subscribe(Pong.WSAdapter.events.CONNECTED, function() {
    $('#connect').attr('disabled', 'disabled');
    $('#disconnect').removeAttr('disabled');
});

ws.subscribe(Pong.WSAdapter.events.DISCONNECTED, function() {
    $('#connect').removeAttr('disabled');
    $('#disconnect').attr('disabled', 'disabled');
    $('#join-left').attr('disabled', 'disabled');
    $('#join-right').attr('disabled', 'disabled');
});

ws.subscribe(Pong.WSAdapter.events.GAMESTATE, function(packet) {
    var gameState = packet.gameState();
    if (gameState == Pong.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
        var leftPlayerState = packet.leftPlayerState();
        if (leftPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-left').removeAttr('disabled');
        } else {
            $('#join-left').attr('disabled', 'disabled');
        }

        var rightPlayerState = packet.rightPlayerState();
        if (rightPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-right').removeAttr('disabled');
        } else {
            $('#join-right').attr('disabled', 'disabled');
        }
    }
});