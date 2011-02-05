Pong.EventsRemote.Receiver = function(transport) {
    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown',
        GAMESTATE: 'gameState',
        ROUNDSTARTED: 'roundStarted',
        GAMESNAPSHOT: 'gameSnapshot'
    };
    
    var observer = Utils.Observer();

    transport.subscribe(Pong.Packets.GameState.id, function(data) {
        observer.fire(events.GAMESTATE, data);
    });

    transport.subscribe(Pong.Packets.RoundStarted.id, function(data) {
        observer.fire(events.ROUNDSTARTED, data);
    });

    transport.subscribe(Pong.Packets.GameSnapshot.id, function(data) {
        observer.fire(events.GAMESNAPSHOT, data);
    });

    transport.subscribe(Pong.Packets.ShieldMoveUp.id, function(data) {
        observer.fire(events.MOVEUP, data);
    });

    transport.subscribe(Pong.Packets.ShieldMoveDown.id, function(data) {
        observer.fire(events.MOVEDOWN, data);
    });

    transport.subscribe(Pong.Packets.ShieldStop.id, function(data) {
        observer.fire(events.STOP, data);
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
};
