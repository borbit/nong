Pong.Element = function(area) {
    var observer = Pong.Observer();
    observer.register(Pong.Element.Events.changingStarted);
    observer.register(Pong.Element.Events.changingFinished);

    return {
        area: area,
        observer: observer
    }
};

Pong.Element.Events = {
    changingStarted: 'changingStarted',
    changingFinished: 'changingFinished'
};