(function() {
    Pong.View = function(stage) {
        var renderers = {};

        stage.subscribe(Pong.Stage.events.changed, function(element) {
            if(renderers[element.id]) {
                renderers[element.id].render(element);
            }
        });

        return {
            addRenderer: function(elementId, renderer) {
                renderers[elementId] = renderer;
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
    Pong.Renderers.Ball = function(node) {
        return {
            render: function(element) {
                updateCoordinates(element, node)
            }
        };
    };

    Pong.Renderers.Shield = function(node) {
        return {
            render: function(element) {
                updateCoordinates(element, node)
            }
        };
    };
    
})();