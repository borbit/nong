(function(ns) {

ns.Observer = function() {
    var triggers = {};

    function register(eventName) {}

    function fire(eventName, args) {
        if(triggers[eventName] != null) {
            var count = triggers[eventName].length;
            for(var j = 0; j < count; j++) {
                triggers[eventName][j].apply(null, args);
            }
        }
    }

    function subscribe(eventName, trigger) {
        if(triggers[eventName] == null) {
            triggers[eventName] = [];
            self[eventName] = function() {
               var args = Array.prototype.slice.call(arguments);
               fire(eventName, args);
            };
        }
        triggers[eventName].push(trigger);
    }

    function unsubscribe(eventName) {
        if(isSet(triggers[eventName])) {
            delete triggers[eventName];
            delete self[eventName];
        }
    }

    var self = {
        fire: fire,
        register: register,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };

    return self;
};

}((typeof exports === 'undefined') ? window.Pong : exports));