Pong.ClientEvents = (function() {
    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown'
    };

    var observer = Pong.Observer();

    $(window).keydown(function(event) {
        if(event.which == 38) {
            observer.fire(events.MOVEUP);
        }
        if(event.which == 40) {
            observer.fire(events.MOVEDOWN);
        }
    });

    $(window).keyup(function(event) {
        if(event.which == 38 || event.which == 40) {
            observer.fire(events.STOP);
        }
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
})();