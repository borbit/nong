Pong.Ball = function(x, y, domNode, publisher) {
    var area = Pong.Area(domNode, {
        x: x, y: y,
        width: 10,
        height: 10
    });
    
    var element = Pong.Element(area);
    var speed = 200;
    var vx = 0.5;
    var vy = 0.5;
    
    render();

    function process() {
        area.x += vx * speed / Pong.Constants.FPS;
        area.y += vy * speed / Pong.Constants.FPS;
        element.observer.changed();
    }

    function render() {
        element.area.domNode.css({
            top: area.y,
            left: area.x
        });
    }

    function setVX(v) {
        vx = v;
    }

    function setVY(v) {
        vy = v;
    }

    function getVX() {
        return vx;
    }

    function getVY() {
        return vy;
    }

    return $.extend(element, {
        render: render,
        process: process,
        setVX: setVX,
        setVY: setVY,
        getVX: getVX,
        getVY: getVY,
        active: true
    });
};