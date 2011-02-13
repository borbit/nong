(function(ns) {

var pong = require('../shared/pong');

ns.Game = function() {
    this.shields = {
        left: new pong.Shield(40, 0, 'left'),
        right: new pong.Shield(750, 0, 'right')
    };
    this.goals = {
        left: new pong.Goal(-50, 0, 600),
        right: new pong.Goal(800, 0, 600)
    };
    
    this.ball = new pong.Ball('ball');
    this.stage = pong.Stage();

    this.stage.addStaticElement(new pong.StageWall(0, -50, 800))
              .addStaticElement(new pong.StageWall(0, 600, 800))
              .addStaticElement(this.goals.left)
              .addStaticElement(this.goals.right)
              .addDynamicElement(this.shields.left)
              .addDynamicElement(this.shields.right)
              .addDynamicElement(this.ball);
};

}((typeof exports === 'undefined') ? window.Pong : exports));