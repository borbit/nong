Pong.Field = function(area, gameLoop, renderLoop) {

    var lastElementId = 0;

    function addElement(element) {
        element.id = lastElementId++;
        element.subscribe(Pong.Element.Events.changingStarted, function() {
            gameLoop.addElement(element);
            renderLoop.addElement(element);
        });
        element.subscribe(Pong.Element.Events.changingFinished, function() {
            gameLoop.removeElement(element.id);
            renderLoop.removeElement(element.id);
        });
    }

    function start() {
        gameLoop.start();
        renderLoop.start();
    }

    return {
        start: start,
        addElement: addElement
    }

};