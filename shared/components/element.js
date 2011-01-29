(function(ns) {

var utils = require('../utils');

function Element() {
    this.id = utils.Functions.getUniqId();
    this.observer = utils.Observer();
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
        var targetElementType = utils.Functions.getTypeName(targetElement);
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

}((typeof exports === 'undefined') ? window.Components : exports));