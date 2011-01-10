Pong.RenderLoop = function() {
    var timerId = null;
    var elements = [];
    var renderers = {};

    function start() {
        timerId = setInterval(function() {
            for(var i = 0, len = elements.length; i < len; i++) {
                if(renderers[elements[i]]) {
                    renderers[elements[i]].render();
                }
            }
        }, 1000 / Pong.Globals.FPS);
    }

    function stop() {
        if(timerId) {
            clearInterval(timerId);
        }
    }

    function addElement(elementId) {
        elements.push(elementId);
    }

    function removeElement(elementId) {
        elements.splice(elements.indexOf(elementId), 1);
    }

    function addRenderer(renderer) {
        renderers[renderer.elementId] = renderer;
        return this;
    }

    return {
        start: start,
        stop: stop,
        addElement: addElement,
        addRenderer: addRenderer,
        removeElement: removeElement
    }
};