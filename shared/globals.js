(function() {
    var ns;
    
    if(typeof exports === 'undefined') {
        if(typeof window.Pong === 'undefined') {
            window.Pong = {};
            window.Components = {};
            window.Utils = {};
        }
        ns = window.Pong;
    } else {
        ns = exports.Globals = {};
    }

    ns.Globals= {};
    ns.Globals.FPS = 50;
    ns.Globals.RFPS = 50;
})();