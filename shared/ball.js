Pong.Ball = function(x, y, publisher) {
    var region = Pong.Region({
        x: x, y: y,
        width: 10,
        height: 10
    });
    
    var element = Pong.Element(region);
    var speed = 400;
    
    element.vx = 0.5;
    element.vy = 0.5;

    function process() {
        region.x += element.vx * speed / Pong.Constants.FPS;
        region.y += element.vy * speed / Pong.Constants.FPS;
        element.observer.changed();
    }

    return $.extend(element, {
        process: process,
        active: true
    });
};