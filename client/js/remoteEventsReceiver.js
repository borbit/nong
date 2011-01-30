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

    ws.subscribe(Pong.Packets.ShieldMoveUp.id, function(data) {
        observer.fire(events.MOVEUP, data);
    });

    ws.subscribe(Pong.Packets.ShieldMoveDown.id, function(data) {
        observer.fire(events.MOVEDOWN, data);
    });

    ws.subscribe(Pong.Packets.ShieldStop.id, function(data) {
        observer.fire(events.STOP, data);
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
};
