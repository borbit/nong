(function(ns) {

var pong = require('../pong'),
    utils = require('../utils');

ns.GameLoop = function(dynamics) {
    var observer = utils.Observer(),
        events = ns.GameLoop.events,
        timerId = null, prevTick = 0,
        elements = [];

    function start() {
        timerId = setInterval(tick, Math.floor(1000 / pong.Globals.FPS));
    }

    function stop() {
        if(timerId) {
            clearInterval(timerId);
        }
    }

    function tick() {
        var delta = (new Date()).getTime() - prevTick;
        console.log(delta);

        var count = elements.length;

        for(var i = 0; i < count; i++) {
            elements[i].update(delta);
        }
        
        //observer.fire(events.tickWithUpdates, elements);

        prevTick = (new Date()).getTime();
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