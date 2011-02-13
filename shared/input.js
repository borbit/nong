(function(ns) {
var _ = require('./utils')._;

ns.Input = function() {
    this.up = false;
    this.down = false;
};

}((typeof exports === 'undefined') ? window.Pong : exports));