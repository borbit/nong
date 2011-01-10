(function(ns, undefined) {

var hasRequire = (typeof require !== 'undefined');
var Functions = (hasRequire) ? require('functions') : ns.Functions;
var Observer = (hasRequire) ? require('observer') : ns.Observer;

ns.Element = function element(region) {
    var observer = Observer();
    observer.register(element.events.changed);
    observer.register(element.events.changingStarted);
    observer.register(element.events.changingFinished);

    return {
        id: Functions.getUniqId(),
        region: region,
        active: false,
        observer: observer,
        subscribe: observer.subscribe
    }
};

ns.Element.events = {
    changed: 'changed',
    changingStarted: 'changingStarted',
    changingFinished: 'changingFinished'
};

}((typeof exports === 'undefined') ? window.Pong : exports));