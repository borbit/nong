(function(ns, undefined) {

var hasRequire = (typeof require !== 'undefined'),
    Element = hasRequire ? require('element') : ns.Element,
    Region = hasRequire ? require('region') : ns.Region;

ns.Ball = function(x, y) {
    var region = Region({
        x: x, y: y,
        width: 10,
        height: 10
    });
    
    var element = Element(region);
    element.vx = 0.5;
    element.vy = 0.5;

    return element;
};

}((typeof exports === 'undefined') ? window.Pong : exports));