var namespace;
if(typeof exports === 'undefined') {
    if(typeof window.Pong === 'undefined') {
        window.Pong = {};
    }
    namespace = window.Pong;
} else {
    namespace = exports;
}

(function(ns) {
    ns.Globals= {};
    ns.Globals.FPS = 50;
    ns.Globals.RFPS = 0;
})(namespace);