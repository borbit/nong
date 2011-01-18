$(function() {
    $('#connect').bind('click', ws.connect);
    $('#disconnect').bind('click', ws.disconnect);
    $('#join-left').bind('click', publisher.joinLeft);
    $('#join-right').bind('click', publisher.joinRight);
    console.log('Initialization complete');
});

var ws = Pong.ClientWSAdapter();
var publisher = Pong.RemoutEventsPublisher(ws);
var receiver = Pong.RemoutEventsReceiver(ws);

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

receiver.subscribe(Pong.RemoutEventsReceiver.events.GAMESTATE, function(packetData) {
    if (packetData.gameState == Pong.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
        var leftPlayerState = packetData.leftPlayerState;
        if (leftPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-left').removeAttr('disabled');
        } else {
            $('#join-left').attr('disabled', 'disabled');
        }

        var rightPlayerState = packetData.rightPlayerState;
        if (rightPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-right').removeAttr('disabled');
        } else {
            $('#join-right').attr('disabled', 'disabled');
        }
    }
});