Pong.Shield = function(x, y, domNode, publisher) {
    var area = Pong.Area(domNode, {
        x: x, y: y,
        width: 10,
        height: 80
    });

    var element = Pong.Element(area);
    var moveUp = false;
    var moveDown = false;
    var speed = 500;

    render();

    publisher.subscribe(publisher.events.moveUp, function() {
        moveUp = true;
        element.observer.changingStarted();
    });

    publisher.subscribe(publisher.events.moveDown, function() {
        moveDown = true;
        element.observer.changingStarted();
    });

    publisher.subscribe(publisher.events.stop, function() {
        moveUp = false;
        moveDown = false;
        element.observer.changingFinished();
    });

    function process() {
        if(moveUp) {
            area.y -= parseInt(speed / Pong.Constants.FPS);
        }

        if(moveDown) {
            area.y += parseInt(speed / Pong.Constants.FPS);
        }
    }

    function render() {
        element.area.domNode.css({
            top: area.y,
            left: area.x
        });
    }

    return $.extend(element, {
        render: render,
        process: process
    });
};