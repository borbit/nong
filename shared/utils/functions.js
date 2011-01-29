(function(ns) {

ns.getUniqId = (function() {
    var lastElementId = 0;

    return function() {
        return lastElementId++;
    };
})();

ns.inherit = function(child, parent) {
    function F() {}
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superproto = parent.prototype;
    return child;
};

ns.getTypeName = function(value) {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((value).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

}((typeof exports === 'undefined') ? window.Utils = {} : exports));