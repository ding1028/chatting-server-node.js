module.exports = function(io) {
    io.on('connection', function(socket) {
      require('./controllers/graph')(socket);
      require('./controllers/chat')(socket);
    });

};
