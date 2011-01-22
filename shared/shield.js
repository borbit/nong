(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Element = hasRequire ? require('element').Element : ns.Element,
    Region = hasRequire ? require('region').Region : ns.Region;

ns.Shield = function(x, y) {
    var region = Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    return Element(region);
};

}((typeof exports === 'undefined') ? window.Pong : exports));