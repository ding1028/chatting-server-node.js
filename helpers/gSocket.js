var io = null;


exports.setSocket = function(socketio) {
   io = socketio;
}

exports.getSocket = function() {
  return io;
}
