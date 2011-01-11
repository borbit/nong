$(function() {
    var stageNode = $('<div id="field"></div>');
    var shield1Node = $('<div class="shield" style="top:250px;left:40px;"></div>');
    var shield2Node = $('<div class="shield" style="top:250px;left:750px;"></div>');
    var ballNode = $('<div class="boll"></div>');

    stageNode.append(ballNode)
             .append(shield1Node)
             .append(shield2Node)
             .appendTo(document.body);

    var shield1 = Pong.Shield(40, 250);
    var shield2 = Pong.Shield(750, 250);
    var ball = Pong.Ball(500, 100);

    var stage = Pong.Stage();

    var shield1Updater = stage.addShield(shield1, Pong.ClientEvents);
    var shield2Updater = stage.addShield(shield2, Pong.ClientEvents);
    var ballUpdater = stage.addBall(ball);
    stage.start();

    var view = Pong.View();
    view.addRenderer(shield1Updater, Pong.Renderers.Shield(shield1Node));
    view.addRenderer(shield2Updater, Pong.Renderers.Shield(shield2Node));
    view.addRenderer(ballUpdater, Pong.Renderers.Ball(ballNode));
});