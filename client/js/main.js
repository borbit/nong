$(function() {

    var fieldNode = $('<div id="field"></div>');
    var leftShieldNode = $('<div class="shield"></div>');
    var rightShieldNode = $('<div class="shield"></div>');
    var ballNode = $('<div class="boll"></div>');

    fieldNode.appendTo(document.body)
             .append(leftShieldNode)
             .append(rightShieldNode)
             .append(ballNode);

    var field = Pong.Field(Pong.Area(fieldNode, {
        width: 800,
        height: 600
    }), Pong.GameLoop(), Pong.RenderLoop());

    var leftShield  = Pong.Shield(40 , 200, leftShieldNode,  Pong.ClientEvents);
    var rightShield = Pong.Shield(720, 200, rightShieldNode, Pong.ClientEvents);
    
    var ball = Pong.Ball(500, 100, ballNode);

    field.addShield(leftShield);
    field.addShield(rightShield);
    field.addBall(ball);
    field.start();

});