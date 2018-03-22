var sockets = [];

exports.setSocketId = function(key, socketId) {
   sockets[key] = socketId;
}

exports.getSocketId = function(key) {
  return sockets[key];
}
