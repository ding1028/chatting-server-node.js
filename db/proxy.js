'use strict';

var Promise  = require('bluebird');
var gPool  = require('../helpers/pool');
var pool = gPool.getPool();
var checkKey = function (key, callback) {

  console.log("proxy db-check key", key);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("proxy db-check key", err);
      connection.release();
      callback(err, null);
    }
    var sql = "SELECT id, graph, mini_chat, video FROM game_proxy WHERE proxy_key='"+key+"' LIMIT 1";
    console.log("sql", sql);

    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("proxy db-check key - sql", err);
        callback(err, null);
      } else {
        callback(null, result);

      }
    })
  });
}

module.exports = {
	checkKey
};
