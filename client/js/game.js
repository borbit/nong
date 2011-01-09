$(function() {
    var stageNode = $('<div id="field"></div>');
    var shield1Node = $('<div class="shield" style="top:250px;left:40px;"></div>');
    var shield2Node = $('<div class="shield" style="top:250px;left:750px;"></div>');
    var ballNode = $('<div class="boll"></div>');

    stageNode.append(ballNode)
             .append(shield1Node)
             .append(shield2Node)
             .appendTo(document.body);

    var shield1 = Pong.Shield(40, 250, Pong.ClientEvents);
    var shield2 = Pong.Shield(750, 250, Pong.ClientEvents);
    var ball = Pong.Ball(500, 100);

    var gameLoop = Pong.GameLoop();
    var renderLoop = Pong.RenderLoop();

    renderLoop.addRenderer(Pong.Renderers.Shield(shield1, shield1Node))
              .addRenderer(Pong.Renderers.Shield(shield2, shield2Node))
              .addRenderer(Pong.Renderers.Ball(ball, ballNode));

    var stage = Pong.Stage(gameLoop, renderLoop);

    stage.addShield(shield1)
         .addShield(shield2)
         .addBall(ball)
         .start();
});