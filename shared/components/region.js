(function(ns) {

var utils = require('../utils');
        
ns.Region = function(options) {
    return utils.Functions.extend({
        x: 0,
        y: 0,
        width: 0,
        height: 0,

        left: function() {
            return this.x;
        },

        right: function() {
            return this.x + this.width;
        },

        top: function() {
            return this.y;
        },

        bottom: function() {
            return this.y + this.height
        },

        intersectsWith: function(region) {
            return this.right() > region.left() && this.left() < region.right() &&
                this.bottom() > region.top() && this.top() < region.bottom();
        }
    }, options);
};

}((typeof exports === 'undefined') ? window.Components : exports));