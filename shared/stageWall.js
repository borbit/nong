(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('./functions') : ns.Functions,
    Element = hasRequire ? require('./element').Element : ns.Element,
    Region = hasRequire ? require('./region').Region : ns.Region;

function StageWall(x, y, length, orientation) {
    this.region = Region({
        x: x, y: y,
        width: orientation == ns.StageWall.orientation.HORIZONTAL ? length : 50,
        height: orientation == ns.StageWall.orientation.VERTICAL ? length : 50
    });

    this.orientation = orientation;
}

Functions.inherit(StageWall, Element);

ns.StageWall = StageWall;

ns.StageWall.orientation = {
    'HORIZONTAL' : 'horizontal',
    'VERTICAL': 'vertical'
}

}((typeof exports === 'undefined') ? window.Pong : exports));