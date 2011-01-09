Pong.Shield = function(x, y, publisher) {
    var region = Pong.Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    var element = Pong.Element(region);
    var moveUp = false;
    var moveDown = false;
    var speed = 500;

    publisher.subscribe(publisher.events.moveUp, function() {
        if(!moveUp) {
            moveUp = true;
            element.observer.changingStarted();
        }
    });

    publisher.subscribe(publisher.events.moveDown, function() {
        if(!moveDown) {
            moveDown = true;
            element.observer.changingStarted();
        }
    });

    publisher.subscribe(publisher.events.stop, function() {
        moveUp = false;
        moveDown = false;
        element.observer.changingFinished();
    });

    function process() {
        if(moveUp) {
            region.y -= parseInt(speed / Pong.Constants.FPS);
        }
        if(moveDown) {
            region.y += parseInt(speed / Pong.Constants.FPS);
        }
    }

    return $.extend(element, {
        process: process
    });
};