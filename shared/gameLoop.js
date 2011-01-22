(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Globals = (hasRequire) ? require('./globals').Globals : ns.Globals,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.GameLoop = function() {
    var observer = Observer(),
        events = ns.GameLoop.events,
        timerId = null, prevTick = 0,
        elements = [], updaters = {};

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
        
        var count = elements.length;
        
        if(count > 0) {
            var updated = [];
            
            for(var i = 0; i < count; i++) {
                updaters[elements[i]].update();
                updated.push(updaters[elements[i]].element);
            }
            
            observer.fire(events.tickWithUpdates, updated);
        }

        prevTick = +(new Date());
    }

    function addElement(elementId) {
        if(elements.indexOf(elementId) < 0) {
            if(updaters[elementId] != null) {
                elements.push(elementId);
            } else {
                throw 'Adding element without updater';
            }
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