(function(ns, undefined) {

ns.Region = function(options) {
    return $.extend({
        x: 0, y: 0,
        width: 0,
        height: 0
    }, options);
};

}((typeof exports === 'undefined') ? window.Pong : exports));