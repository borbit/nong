(function(ns) {
var _ = require('../utils')._;
var packets = require('../pong').Packets;

ns.Pinger = function(transport) {
    this.pings = [];
    this.pongs = [];
    this.size = 3;
    this.timer = null;
    this.timerFrequency = 500;
    this.transport = transport;

    this.transport.on(packets.Pong.id, _.bind(function(data) {
        this.pong(data.id);
    }, this));
};

ns.Pinger.prototype.pong = function(pingId) {
    if (_.indexOf(this.pings, pingId) == -1) {
        return;
    }

    var now = (new Date()).getTime();
    this.pongs.push(now - pingId);

    if (this.pongs.length > this.size) {
        this.pongs.splice(0, this.pongs.length - this.size);
    }
};

ns.Pinger.prototype.ping = function() {
    var pingId = (new Date()).getTime();

    this.pings.push(pingId);

    if (this.pings.length > this.size) {
        this.pings.splice(0, this.pings.length - this.size);
    }

    var payload = {id: pingId};

    if (this.isReady()) {
       payload.ping = this.average();
    }
    
    this.transport.sendPacket(packets.Ping(payload));
};

ns.Pinger.prototype.isReady = function() {
    return this.pongs.length >= this.size;
};

ns.Pinger.prototype.average = function() {
    var sum = _.reduce(this.pongs, function(memo, pong) {
        return memo + pong;
    }, 0);

    return Math.round(sum / this.pongs.length / 2);
};

ns.Pinger.prototype.start = function() {
    this.timer = setInterval(_.bind(this.ping, this), this.timerFrequency)
};

ns.Pinger.prototype.stop = function() {
    if(this.timer) {
       clearInterval(this.timer);
       this.timer = null;
    }
};

}((typeof exports === 'undefined') ? window.Latency : exports));