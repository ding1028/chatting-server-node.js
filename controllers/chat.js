'use strict';

var Promise = require('bluebird');
var chatService = require('../db/chat');
var proxyService = require('../db/proxy');
var userService = require('../db/user');
var roomService = require('../db/room');
var gSocketIds = require('../helpers/gSocketIds');
var gSocket        = require('../helpers/gSocket');
var io = gSocket.getSocket();

module.exports = function(socket) {
  socket.on('announce', function(payload){
    userService.findOne(payload.user_id, (err, result) => {
      if(result) {
          console.log("action - announce", payload);
          if(payload.user_id)
            gSocketIds.setSocketId(payload.user_id, socket.id);
            socket.join('all');
          if(result.proxy) {
            let proxyRoomName = 'proxy'+result.proxy;
            socket.join(proxyRoomName);
          }
      }else {
        console.log("action - announce user not exist", payload.user_id);
      }
    });
  });

  socket.on('joinRoom', function(payload){
    console.log("action- joinRoom", payload);
    if(payload.user_id)
      gSocketIds.setSocketId(payload.user_id, socket.id);
    if(payload.room_id) {
      let roomName = 'room'+payload.room_id;
      socket.join(roomName);
    }
  });

  socket.on('leaveRoom', function(payload){
    console.log("action- leaveRoom", payload);
    if(payload.user_id)
      gSocketIds.setSocketId(payload.user_id, socket.id);
    if(payload.room_id) {
      let roomName = 'room'+payload.room_id;
      socket.leave(roomName);
    }
  });

  socket.on('sendMessage', function(payload) {

      userService.findOne(payload.chat_creator, (err, result) => {
        console.log("user found", result);
        if(!result)
          return;
        console.log("action - sendMessage", payload);
        var currentdate     = new Date();
        var datetime        = currentdate.getFullYear() + "-" +
                              ('0' + (currentdate.getMonth()+1)).slice(-2)  + "-"+
                              ('0' + currentdate.getDate()).slice(-2) + " "  +
                              ('0' + currentdate.getHours()).slice(-2) + ":"   +
                              ('0' + currentdate.getMinutes()).slice(-2) + ":" +
                              ('0' + currentdate.getSeconds()).slice(-2);
         payload.chat_date = datetime;
         if(!payload.chat_read) payload.chat_read = 0;
         if(payload.chat_type === 1) payload.chat_receiver = result.proxy;

         chatService.create(payload, (err, result)=> {
           console.log("create result", result);
         });
         if(payload.chat_type === 0) {
           console.log("all send message");
           io.to('all').emit('receiveMessage', payload);
         }
         if(payload.chat_type === 1) {
           console.log("proxy all send message");
           let proxyRoomName = 'proxy'+result.proxy;
           console.log("proxy", proxyRoomName);
           io.to(proxyRoomName).emit('receiveMessage', payload);
         }
         if(payload.chat_type === 2) {
           let roomName  = 'room'+payload.chat_receiver;
           io.to(roomName).emit('receiveMessage', payload);
         }

         if(payload.chat_type === 3) {
           let socketId = gSocketIds.getSocketId(payload.chat_receiver);
           if(socketId && io.sockets.connected[socketId]) {
             io.sockets.connected[socketId].emit('receiveMessage', payload);
           }
         }
      });


  });

  socket.on('createRoom', function(payload) {
    var currentdate     = new Date();
    var datetime        = currentdate.getFullYear() + "-" +
                          ('0' + (currentdate.getMonth()+1)).slice(-2)  + "-"+
                          ('0' + currentdate.getDate()).slice(-2) + " "  +
                          ('0' + currentdate.getHours()).slice(-2) + ":"   +
                          ('0' + currentdate.getMinutes()).slice(-2) + ":" +
                          ('0' + currentdate.getSeconds()).slice(-2);
    payload.created_date = datetime;
    roomService.create(payload , function (err, result){
      payload.room_id = result.insertId;
      io.to('all').emit('createdRoom', payload);
    });
  });

  socket.on('deleteRoom', function(payload){
    roomService.destroy(payload , function (err, result){
      io.to('all').emit('deletedRoom', payload);
    });
  });

  socket.on('findRoom', function(payload){
    console.log("findRoom", payload);
    roomService.findAll(function(err, result){
      if(result)
      socket.emit('findRoom', result);
    });
  });

};
