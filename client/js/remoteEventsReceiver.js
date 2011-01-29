Pong.RemoteEventsReceiver = function(ws) {
    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown',
        GAMESTATE: 'gameState',
        GAMESNAPSHOT: 'gameSnapshot'
    };
    
    var observer = Utils.Observer();

    ws.subscribe(Pong.Packets.GameState.id, function(data) {
        observer.fire(events.GAMESTATE, data);
    });

    ws.subscribe(Pong.Packets.GameSnapshot.id, function(data) {
        observer.fire(events.GAMESNAPSHOT, data);
    });

    ws.subscribe(Pong.Packets.ShieldMoveUp.id, function() {
        observer.fire(events.MOVEUP);
    });

    ws.subscribe(Pong.Packets.ShieldMoveDown.id, function() {
        observer.fire(events.MOVEDOWN);
    });

    ws.subscribe(Pong.Packets.ShieldStop.id, function() {
        observer.fire(events.STOP);
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
};
