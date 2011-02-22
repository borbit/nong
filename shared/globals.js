(function() {
    var ns;
    
    if(typeof exports === 'undefined') {
        ns = window.Pong;
    } else {
        ns = exports;
    }

    ns.Globals= {};
    ns.Globals.SPS = 10; // snapshots per second
    ns.Globals.FPS = 20;
    ns.Globals.RFPS = 20;
    ns.Globals.COUNTDOWN = 3;
    ns.Globals.SIMULATED_LAG = 100;
    ns.Globals.ROUNDS_TO_WIN = 5;
})();