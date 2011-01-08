Pong.GameLoop = function() {
    var timerId = null;
    var elements = {};

    function start() {
        timerId = setInterval(function() {
            for(var i in elements) {
                elements[i].process();
            }
        }, 1000 / Pong.Constants.FPS);
    }

    function stop() {
        if(timerId) {
            clearInterval(timerId);
        }
    }

    function addElement(element) {
        elements[element.id] = element;
    }

    function removeElement(elementId) {
        delete elements[elementId];
    }

    return {
        start: start,
        stop: stop,
        addElement: addElement,
        removeElement: removeElement
    }
};