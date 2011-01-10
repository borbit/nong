(function(ns, undefined) {

ns.Functions = {};
ns.Functions.getUniqId = function getUniqId() {
    return getUniqId.lastElementId++;
};
ns.Functions.getUniqId.lastElementId = 0;

ns.Functions.extend = function(first, second) {
    for(var i in second) {
        first[i] = second[i];
    }
    return first;
};

}((typeof exports === 'undefined') ? window.Pong : exports));