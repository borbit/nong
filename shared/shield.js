(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Element = hasRequire ? require('element') : ns.Element,
    Region = hasRequire ? require('region') : ns.Region;

ns.Shield = function(x, y) {
    var region = Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    return Element(region);
};

}((typeof exports === 'undefined') ? window.Pong : exports));