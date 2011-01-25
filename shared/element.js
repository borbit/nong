(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('./functions') : ns.Functions,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

function Element() {
    this.id = Functions.getUniqId();
    this.observer = Observer();
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
    },
    
    subscribe: function(eventName, trigger) {
        this.observer.subscribe(eventName, trigger);
    }
}


ns.Element = Element;
ns.Element.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));