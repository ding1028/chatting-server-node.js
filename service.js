'use strict';
var Promise        = require('bluebird');
var gSocket        = require('./helpers/gSocket');
var graphData      = require('./helpers/graphData');


var Service = function(opts){
  this.interval = opts.interval||1000;
};


module.exports = Service;

Service.prototype.run = function () {
  this.interval = setInterval(this.tick.bind(this), this.interval);
};

Service.prototype.close = function () {
  clearInterval(this.interval);
};

Service.prototype.tick = function() {
  //check games and send timeout
  Service.drawGraph();
};

Service.drawGraph = function () {
  var io = gSocket.getSocket();
    if(io) {
        let random = randomInt(1000,2000);
        let data ={
          Value : random
        }
        graphData.addGraphPoint(random);
        io.to('graph').emit('graph',data);
    }
}


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
