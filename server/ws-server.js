var ws = require('websocket-server');
var wsClient = require('./ws-client');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    CLIENT: 'client'
};

exports.createServer = function() {
    var server = ws.createServer();
    var emitter = new Emitter();
    
    server.addListener('connection', function(connection) {        
        emitter.emit(events.CLIENT, wsClient.createClient(connection));
    });
    
    function addEventListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        on: addEventListener,
        listen: server.listen
    };
}