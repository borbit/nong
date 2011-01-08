$(function() {

    var fieldNode = $('<div id="field"></div>').appendTo(document.body);
    var leftShieldNode = $('<div class="shield"></div>').appendTo(fieldNode);
    var rightShieldNode = $('<div class="shield"></div>').appendTo(fieldNode);

    var field = Pong.Field(Pong.Area(fieldNode, {
        width: 800,
        height: 600
    }), Pong.GameLoop(), Pong.RenderLoop());

    var leftShield = Pong.Shield(40, 0, leftShieldNode, Pong.ClientEvents);
    var rightShield = Pong.Shield(720, 0, rightShieldNode, Pong.ClientEvents);

    field.addElement(leftShield);
    field.addElement(rightShield);
    field.start();

});