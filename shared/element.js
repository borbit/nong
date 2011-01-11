(function(ns, undefined) {

var hasRequire = (typeof require !== 'undefined');
var Functions = (hasRequire) ? require('functions') : ns.Functions;

ns.Element = function element(region) {
    return {
        id: Functions.getUniqId(),
        region: region
    }
};

}((typeof exports === 'undefined') ? window.Pong : exports));