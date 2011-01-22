(function() {
    Pong.View = function(stage) {
        var renderers = {};
        var nodes = {};

        stage.subscribe(Pong.Stage.events.changed, function(elements) {
            for(var i = 0, len = elements.length; i < len; i++) {
                renderers[elements[i].id].render(elements[i], nodes[elements[i].id]);
            }
        });

        return {
            addRenderer: function(elementId, node, renderer) {
                renderers[elementId] = renderer;
                nodes[elementId] = node;
            }
        };
    };

    function updateCoordinates(element, node) {
        node.css({
            top: element.region.y,
            left: element.region.x
        });
    }

    Pong.Renderers = {};
    Pong.Renderers.Ball = function() {
        return {
            render: updateCoordinates
        };
    };

    Pong.Renderers.Shield = function() {
        return {
            render: updateCoordinates
        };
    };
    
})();