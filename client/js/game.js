$(function() {
    var shield1 = Pong.Shield(40, 250);
    var shield2 = Pong.Shield(750, 250);
    var ball = Pong.Ball(500, 100);

    var stage = Pong.Stage();
    stage.addShield(shield1, Pong.ClientEvents);
    stage.addShield(shield2, Pong.ClientEvents);
    stage.addBall(ball);
    stage.start();

    var view = Pong.View(stage);
    view.addRenderer(shield1.id, Pong.Renderers.Shield($('#shield1')));
    view.addRenderer(shield2.id, Pong.Renderers.Shield($('#shield2')));
    view.addRenderer(ball.id, Pong.Renderers.Ball($('#ball')));
});