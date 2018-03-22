'use strict';

var Promise  = require('bluebird');
var graphData  = require('../helpers/graphData');
module.exports = function(socket) {
  socket.on('joinGraph', function(payload){
    console.log("A graph user joined!", socket.id);

      var gData = graphData.getGraphData();
      socket.emit('graphInit', gData);
      socket.join('graph');
  });
  socket.on('leaveGraph',  function(payload) {
      socket.leave('graph');
    console.log("A graph user leave.", socket.id);
  });
  socket.on('disconnect', function() {
 	  console.log("disconnected:"+socket.id);

 	});
};
