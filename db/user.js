'use strict';

var Promise  = require('bluebird');
var gPool  = require('../helpers/pool');
var pool = gPool.getPool();
var findOne = function (id, callback) {

  console.log("user id", id);
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log("connection", err);
      connection.release();
      callback(err, null);
    }
    var sql = "SELECT user_id, proxy FROM game_users WHERE user_id="+id+" LIMIT 1";
    console.log("sql", sql);

    connection.query(sql, function(err, result){
      connection.release();
      if(err) {
        console.log("user  - sql", err);
        callback(err, null);
      } else {
        callback(null, result[0]);

      }
    })
  });
}

module.exports = {
	findOne
};
