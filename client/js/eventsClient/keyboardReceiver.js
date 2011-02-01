Pong.EventsClient.KeyboardReceiver = (function() {
    var events = {
        STOP: 'stop',
        MOVEUP: 'moveUp',
        MOVEDOWN: 'moveDown'
    };

    var observer = Utils.Observer();
    var buttonUpPressed = false;
    var buttonDownPressed = false;

    $(window).keydown(function(event) {
        if(event.which == 38 && !buttonUpPressed) {
            observer.fire(events.MOVEUP);
            buttonUpPressed = true;
        }
        if(event.which == 40 && !buttonDownPressed) {
            observer.fire(events.MOVEDOWN);
            buttonDownPressed = true;
        }
    });

    $(window).keyup(function(event) {
        if(event.which == 38 || event.which == 40) {
            observer.fire(events.STOP);
            buttonUpPressed = false;
            buttonDownPressed = false;
        }
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
})();