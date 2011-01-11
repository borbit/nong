(function(ns) {

ns.Region = function(options) {
    return ns.Functions.extend({
        x: 0, y: 0,
        width: 0,
        height: 0
    }, options);
};

}((typeof exports === 'undefined') ? window.Pong : exports));