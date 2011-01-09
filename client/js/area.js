Pong.Area = function(domNode, options) {
    return $.extend({
        x: 0, y: 0,
        width: 0,
        height: 0,
        domNode: domNode
    }, options);
};