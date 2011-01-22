var packets = require('../shared/packets');
var Client = require('./client');
var Emitter = require('events').EventEmitter;

exports.createPlayer = function(connection) {
    var emitter = new Emitter();
    
    function addEventListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        on: addEventListener
    };
};
