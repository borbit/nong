(function(ns) {

var hasRequire = (typeof require !== 'undefined');
var Functions = (hasRequire) ? require('functions').Functions : ns.Functions;

ns.Element = function element(region) {
    return {
        id: Functions.getUniqId(),
        region: region
    }
};

}((typeof exports === 'undefined') ? window.Pong : exports));