Pong.Element = function element(area) {
    var observer = Pong.Observer();
    observer.register(element.events.changed);
    observer.register(element.events.changingStarted);
    observer.register(element.events.changingFinished);

    return {
        area: area,
        observer: observer,
        subscribe: observer.subscribe
    }
};

Pong.Element.events = {
    changed: 'changed',
    changingStarted: 'changingStarted',
    changingFinished: 'changingFinished'
};