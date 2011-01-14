$(function() {
    var shield1 = Pong.Shield(40, 250);
    var shield2 = Pong.Shield(750, 250);
    var ball = Pong.Ball(100, 100);

    var stage = Pong.Stage();
    stage.addShield(shield1, Pong.ClientEvents);
    stage.addShield(shield2, Pong.ClientEvents);
    stage.addBall(ball);
    stage.start();

    var view = Pong.View(stage);
    var ballsRenderer = Pong.Renderers.Ball();
    var shieldsRenderer = Pong.Renderers.Shield();
    view.addRenderer(shield1.id, $('#shield1'), shieldsRenderer);
    view.addRenderer(shield2.id, $('#shield2'), shieldsRenderer);
    view.addRenderer(ball.id, $('#ball'), ballsRenderer);
});