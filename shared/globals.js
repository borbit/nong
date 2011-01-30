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
        ns = exports;
    }

    ns.Globals= {};
    ns.Globals.SPS = 20; // snapshots per second
    ns.Globals.FPS = 30;
    ns.Globals.RFPS = 30;
})();