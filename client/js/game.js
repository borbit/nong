$(function() {
    var stageNode = $('<div id="field"></div>');

    var shield1Node = $('<div class="shield"></div>');
    var shield2Node = $('<div class="shield"></div>');
    var shield3Node = $('<div class="shield"></div>');
    
    var ball1Node = $('<div class="boll"></div>');
    var ball2Node = $('<div class="boll"></div>');
    var ball3Node = $('<div class="boll"></div>');

    stageNode.appendTo(document.body)
             .append(shield1Node)
             .append(shield2Node)
             .append(shield3Node)
             .append(ball1Node)
             .append(ball2Node)
             .append(ball3Node);

    var stage = Pong.Stage(Pong.Area(fieldNode, {
        width: 800,
        height: 600
    }), Pong.GameLoop(), Pong.RenderLoop());

    var shield1 = Pong.Shield(40 , 200, shield1Node, Pong.ClientEvents);
    var shield2 = Pong.Shield(720, 200, shield2Node, Pong.ClientEvents);
    var shield3 = Pong.Shield(420, 200, shield3Node, Pong.ClientEvents);
    
    var ball1 = Pong.Ball(500, 100, ball1Node);
    var ball2 = Pong.Ball(300, 400, ball2Node);
    var ball3 = Pong.Ball(400, 500, ball3Node);

    stage.addShield(shield1);
    stage.addShield(shield2);
    stage.addShield(shield3);
    stage.addBall(ball1);
    stage.addBall(ball2);
    stage.addBall(ball3);
    stage.start();
});