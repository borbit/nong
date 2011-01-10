(function(ns, undefined) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('functions') : ns.Functions,
    Globals = (hasRequire) ? require('globals') : ns.Globals,
    Element = (hasRequire) ? require('element') : ns.Element,
    Region = (hasRequire) ? require('region') : ns.Region;

ns.Ball = function(x, y, publisher) {
    var region = Region({
        x: x, y: y,
        width: 10,
        height: 10
    });
    
    var element = Element(region);
    var speed = 400;
    
    element.vx = 0.5;
    element.vy = 0.5;

    function process() {
        region.x += element.vx * speed / Globals.FPS;
        region.y += element.vy * speed / Globals.FPS;
        element.observer.changed();
    }

    return Functions.extend(element, {
        process: process,
        active: true
    });
};

}((typeof exports === 'undefined') ? window.Pong : exports));