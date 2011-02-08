(function(ns) {

ns.Game = function() {
    this.shields = {
        left: new ns.Shield(40, 20, 'left'),
        right: new ns.Shield(750, 20, 'right')
    };
    this.goals = {
        left: new ns.Goal(-50, 0, 600),
        right: new ns.Goal(800, 0, 600)
    };
    
    this.ball = new Pong.Ball('ball');
    this.stage = Pong.Stage();

    this.stage.addStaticElement(new ns.StageWall(0, -50, 800))
              .addStaticElement(new ns.StageWall(0, 600, 800))
              .addStaticElement(this.goals.left)
              .addStaticElement(this.goals.right)
              .addDynamicElement(this.shields.left)
              .addDynamicElement(this.shields.right)
              .addDynamicElement(this.ball);
};

}((typeof exports === 'undefined') ? window.Pong : exports));