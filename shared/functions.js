(function(ns) {

ns.getUniqId = (function() {
    var lastElementId = 0;

    return function() {
        return lastElementId++;
    };
})();

ns.extend = function(first, second) {
    for(var i in second) {
        first[i] = second[i];
    }

    return first;
};

ns.isUndefined = function(value) {
    return typeof value === 'undefined';
};

}((typeof exports === 'undefined') ? window.Pong.Functions = {} : exports));