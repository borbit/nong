var namespace;
if(typeof exports === 'undefined') {
    if(typeof window.Pong === 'undefined') {
        window.Pong = {};
    }
    namespace = window.Pong;
} else {
    namespace = exports;
}

(function(ns, undefined) {
    ns.Globals= {};
    ns.Globals.FPS = 50;
})(namespace);