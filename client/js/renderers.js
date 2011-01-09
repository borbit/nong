(function() {
    Pong.Renderers = {};

    function updateCoordinates(element, node) {
        node.css({
            top: element.region.y,
            left: element.region.x
        });
    }
    
    Pong.Renderers.Ball = function(element, node) {
        return {
            elementId: element.id,
            render: function() {
                updateCoordinates(element, node)
            }
        };
    }

    Pong.Renderers.Shield = function(element, node) {
        return {
            elementId: element.id,
            render: function() {
                updateCoordinates(element, node)
            }
        };
    }
})();