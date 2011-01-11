(function() {
    Pong.View = function() {
        return {
            addRenderer: function(updater, renderer) {
                updater.subscribe(Pong.Updaters.events.changed, function() {
                    renderer.render(updater.element);
                });
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