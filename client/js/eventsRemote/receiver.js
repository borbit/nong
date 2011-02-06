Pong.EventsRemote.Receiver = function(transport) {
    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown',
        STOPED: 'stoped',
        MOVEDUP: 'movedUp',
        MOVEDDOWN: 'movedDown',
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

    transport.subscribe(Pong.Packets.ShieldMovedUp.id, function(data) {
        observer.fire(events.MOVEDUP, data);
    });
    transport.subscribe(Pong.Packets.ShieldMovedDown.id, function(data) {
        observer.fire(events.MOVEDDOWN, data);
    });
    transport.subscribe(Pong.Packets.ShieldStoped.id, function(data) {
        observer.fire(events.STOPED, data);
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
};
