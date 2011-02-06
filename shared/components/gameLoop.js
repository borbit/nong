(function(ns) {

var pong = require('../pong'),
    utils = require('../utils');

ns.GameLoop = function() {
    var observer = utils.Observer(),
        events = ns.GameLoop.events,
        timerId = null, prevTick = 0,
        elements = [];

    function start() {
        timerId = setInterval(tick, parseInt(1000 / pong.Globals.FPS));
    }

    function stop() {
        if(timerId) {
            clearInterval(timerId);
        }
    }

    function tick() {
        pong.Globals.RFPS = Math.round(1000 / (+(new Date()) - prevTick));

        if (pong.Globals.RFPS) {
            var count = elements.length;

            if(count > 0) {
                for(var i = 0; i < count; i++) {
                    elements[i].update(1000 / pong.Globals.RFPS);
                }
                observer.fire(events.tickWithUpdates, elements);
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

}((typeof exports === 'undefined') ? window.Components : exports));