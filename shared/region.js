(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = hasRequire ? require('./functions') : ns.Functions;
        
ns.Region = function(options) {
    function left() {
        return this.x;
    }
    
    function right() {
        return this.x + this.width;
    }

    function top() {
        return this.y;
    }

    function bottom() {
        return this.y + this.height
    }
<<<<<<< HEAD

    return ns.Functions.extend({
=======
    return Functions.extend({
>>>>>>> 14a4861baa64af29c7f5a25f028634e8f6dfb7fd
        x: 0, y: 0,
        width: 0,
        height: 0,
        left: left,
        right: right,
        top: top,
        bottom: bottom
    }, options);
};

}((typeof exports === 'undefined') ? window.Pong : exports));