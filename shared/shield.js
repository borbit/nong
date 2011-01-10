(function(ns, undefined) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('functions') : ns.Functions,
    Globals = (hasRequire) ? require('globals') : ns.Globals,
    Element = (hasRequire) ? require('element') : ns.Element,
    Region = (hasRequire) ? require('region') : ns.Region;
    
ns.Shield = function(x, y, publisher) {
    var region = Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    var element = Element(region);
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
            region.y -= parseInt(speed / Globals.FPS);
        }
        if(moveDown) {
            region.y += parseInt(speed / Globals.FPS);
        }
    }

    return Functions.extend(element, {
        process: process
    });
};

}((typeof exports === 'undefined') ? window.Pong : exports));