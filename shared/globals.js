(function() {
var ns;

if(typeof exports === 'undefined') {
    if(typeof window.Pong === 'undefined') {
        window.Pong = {};
    }
    ns = window.Pong;
} else {
    ns = exports;
}

    ns.Globals= {};
    ns.Globals.FPS = 50;
    ns.Globals.RFPS = 50;
})();