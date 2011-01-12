(function(ns) {

ns.Functions = {};
ns.Functions.getUniqId = (function() {
    var lastElementId = 0;

    return function() {
        return lastElementId++;
    };
})();

ns.Functions.extend = function(first, second) {
    for(var i in second) {
        first[i] = second[i];
    }

    return first;
};

}((typeof exports === 'undefined') ? window.Pong : exports));