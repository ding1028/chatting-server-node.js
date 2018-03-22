'use strict';

var Promise  = require('bluebird');
var gPool  = require('../helpers/pool');
var pool = gPool.getPool();
var create = function (payload, callback) {

  console.log("room db-create", payload);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("room create", err);
      connection.release();
      callback(err, null);
    }
    var sql = "INSERT INTO game_chat_room (room_name, room_creator, created_date) "+
              "VALUES ('"+payload.room_name+"', '"+payload.room_creator+
              "', '"+payload.created_date+"')";
    console.log("room sql", sql);
    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("room create - sql", err);
        callback(err, null);
      }
      else
        callback(null, result);
    })
  });
}

var findAll = function (callback) {


  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("connection", err);
      connection.release();
      callback(err, null);
    }
    var sql = "SELECT * FROM game_chat_room";
    console.log("sql", sql);

    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("room  - sql", err);
        callback(err, null);
      } else {
        callback(null, result);

      }
    })
  });
}
var destroy = function (payload, callback) {

  console.log("room db-create", payload);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("room delete", err);
      connection.release();
      callback(err, null);
    }
    var sql = "DELETE FROM game_chat_room WHERE room_id="+payload.room_id;
    console.log("room sql", sql);
    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("room delete - sql", err);
        callback(err, null);
      }
      else
        callback(null, result);
    })
  });
}
module.exports = {
	create,
  destroy,
  findAll
};
