Pong.Element = function element(region) {
    var observer = Pong.Observer();
    observer.register(element.events.changed);
    observer.register(element.events.changingStarted);
    observer.register(element.events.changingFinished);

    return {
        id: getUniqId(),
        region: region,
        active: false,
        observer: observer,
        subscribe: observer.subscribe
    }
};

Pong.Element.events = {
    changed: 'changed',
    changingStarted: 'changingStarted',
    changingFinished: 'changingFinished'
};