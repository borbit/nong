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
            if(buttonDownPressed) {
                observer.fire(events.STOP);
                buttonDownPressed = false;
            }
            observer.fire(events.MOVEUP);
            buttonUpPressed = true;
        }
        if(event.which == 40 && !buttonDownPressed) {
            if(buttonUpPressed) {
                observer.fire(events.STOP);
                buttonUpPressed = false;
            }
            observer.fire(events.MOVEDOWN);
            buttonDownPressed = true;
        }
    });

    $(window).keyup(function(event) {
        if(event.which == 38) {
            if(buttonUpPressed) {
                observer.fire(events.STOP);
                buttonUpPressed = false;
            }
        }
        if(event.which == 40) {
            if(buttonDownPressed) {
                observer.fire(events.STOP);
                buttonDownPressed = false;
            }
        }
    });

    return {
        events: events,
        subscribe: observer.subscribe
    };
})();