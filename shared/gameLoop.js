(function(ns) {

var hasRequire = (typeof require !== 'undefined');
var Globals = (hasRequire) ? require('globals').Globals : ns.Globals;
var Observer = hasRequire ? require('observer').Observer : ns.Observer;

ns.GameLoop = function() {
    var observer = Observer();

    var timerId = null;
    var elements = [];
    var updaters = {};
    var prevTick = 0;

    observer.register(ns.GameLoop.events.tickWithUpdates);

    function start() {
        timerId = setInterval(tick, parseInt(1000 / Globals.FPS));
    }

    function stop() {
        if(timerId) {
            clearInterval(timerId);
        }
    }

    function tick() {
        Globals.RFPS = Math.round(1000 / (+(new Date()) - prevTick));

        for(var i = 0, len = elements.length; i < len; i++) {
            if(updaters[elements[i]] != null) {
                updaters[elements[i]].update();
                observer.tickWithUpdates();
            }
        }

        prevTick = +(new Date());
    }

    function addElement(elementId) {
        if(elements.indexOf(elementId) < 0) {
            elements.push(elementId);
        }
    }

    function removeElement(elementId) {
        if (elements.indexOf(elementId) != -1) {
            elements.splice(elements.indexOf(elementId), 1);
        }
    }

    function addUpdater(updater) {
        updaters[updater.element.id] = updater;
    }

    return {
        start: start,
        stop: stop,
        addUpdater: addUpdater,
        addElement: addElement,
        removeElement: removeElement,
        subscribe: observer.subscribe
    }
};

ns.GameLoop.events = {
    tickWithUpdates: 'tickWithUpdates'
};

}((typeof exports === 'undefined') ? window.Pong : exports));