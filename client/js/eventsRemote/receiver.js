Pong.EventsRemote.Receiver = function(transport) {
    var packets = Pong.Packets;
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

    transport.subscribe(packets.GameState.id, function(data) {
        observer.fire(events.GAMESTATE, data);
    });
    transport.subscribe(packets.RoundStarted.id, function(data) {
        observer.fire(events.ROUNDSTARTED, data);
    });
    transport.subscribe(packets.GameSnapshot.id, function(data) {
        observer.fire(events.GAMESNAPSHOT, data);
    });

    transport.subscribe(packets.ShieldMoveUp.id, function(data) {
        observer.fire(events.MOVEUP, data);
    });
    transport.subscribe(packets.ShieldMoveDown.id, function(data) {
        observer.fire(events.MOVEDOWN, data);
    });
    transport.subscribe(packets.ShieldStop.id, function(data) {
        observer.fire(events.STOP, data);
    });

    transport.subscribe(packets.ShieldMovedUp.id, function(data) {
        observer.fire(events.MOVEDUP, data);
    });
    transport.subscribe(packets.ShieldMovedDown.id, function(data) {
        observer.fire(events.MOVEDDOWN, data);
    });
    transport.subscribe(packets.ShieldStoped.id, function(data) {
        observer.fire(events.STOPED, data);
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
};
