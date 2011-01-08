Pong.Shield = function(x, y, domNode, publisher) {
    var element = Pong.Element(Pong.Area(domNode, {
        x: x, y: y,
        width: 38,
        height: 148
    }));

    var moveUp = false;
    var moveDown = false;
    var speed = 500;

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
            element.area.y -= parseInt(speed / Pong.Constants.FPS);
        }

        if(moveDown) {
            element.area.y += parseInt(speed / Pong.Constants.FPS);
        }
    }

    function render() {
        element.area.domNode.css({
            top: element.area.y,
            left: element.area.x
        });
    }

    return {
        render: render,
        process: process,
        area: element.area,
        subscribe: element.observer.subscribe
    };
};