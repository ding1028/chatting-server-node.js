'use strict';

var Promise  = require('bluebird');
var gPool  = require('../helpers/pool');
var pool = gPool.getPool();
var create = function (payload, callback) {

  console.log("chat db-create", payload);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("chat create", err);
      connection.release();
      callback(err, null);
    }
    var sql = "INSERT INTO game_chat (chat_creator, chat_message, chat_date, chat_type, chat_receiver, chat_read) "+
              "VALUES ('"+payload.chat_creator+"', '"+payload.chat_message+
              "', '"+payload.chat_date+"', "+payload.chat_type+ ", "+payload.chat_receiver+", "+payload.chat_read+")";
    console.log("sql", sql);

    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("chat create - sql", err);
        callback(err, null);
      }
      else
        callback(null, result);
    })
  });
}

module.exports = {
	create
};
