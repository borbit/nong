(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('./functions') : ns.Functions;

function Element() {
    this.id = Functions.getUniqId();
}

Element.prototype = {
    getX: function() {
        return this.region.x;
    },

    getY: function() {
        return this.region.y;
    },

    collidesWith: function(targetElement) {
        return this.region.intersectsWith(targetElement.region);
    },

    hit: function(targetElement) {
        var targetElementType = Functions.getTypeName(targetElement);
        if (targetElementType) {
            var methodName = 'hit' + targetElementType;
            if (this[methodName] !== undefined) {
                this[methodName](targetElement);
            }
        }
    }
}


ns.Element = Element;

}((typeof exports === 'undefined') ? window.Pong : exports));