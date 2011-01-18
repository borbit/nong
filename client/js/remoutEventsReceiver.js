Pong.RemoutEventsReceiver = (function() {
    var events = {
        STATE_DISCONNECTED: 'disconnected',
        STATE_CONNECTING: 'connecting',
        STATE_CONNECTED: 'connected'
    };

    var observer = Pong.Observer();
    observer.register(events.stop);
    observer.register(events.moveUp);
    observer.register(events.moveDown);

    $(window).keydown(function(event) {
        if(event.which == 38) {
            observer.moveUp();
        }

        if(event.which == 40) {
            observer.moveDown();
        }
    });

    $(window).keyup(function(event) {
        if(event.which == 38 || event.which == 40) {
            observer.stop();
        }
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
})();