(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Globals = (hasRequire) ? require('./globals').Globals : ns.Globals,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.GameLoop = function() {
    var observer = Observer(),
        events = ns.GameLoop.events,
        timerId = null, prevTick = 0,
        elements = [];

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

        if (Globals.RFPS) {
            var count = elements.length;

            if(count > 0) {
                var updated = [];

                for(var i = 0; i < count; i++) {
                    elements[i].update();
                    updated.push(elements[i]);
                }

                observer.fire(events.tickWithUpdates, updated);
            }
        }

        prevTick = +(new Date());
    }

    function addElement(element) {
        if(elements.indexOf(element) < 0) {
            elements.push(element);
        }
    }

    function removeElement(element) {
        if (elements.indexOf(element) != -1) {
            elements.splice(elements.indexOf(element), 1);
        }
    }

    return {
        start: start,
        stop: stop,
        addElement: addElement,
        removeElement: removeElement,
        subscribe: observer.subscribe
    }
};

ns.GameLoop.events = {
    tickWithUpdates: 'tickWithUpdates'
};

}((typeof exports === 'undefined') ? window.Pong : exports));