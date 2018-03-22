var express = require('express');
var app = express();
var socket = require('socket.io');
var server = app.listen(3000);
var io = socket.listen(server);
var async = require('async');
var mysql= require('mysql');
var gSocket = require('./helpers/gSocket');
var gPool = require('./helpers/pool');
var Service = require('./service');
var config = require('./config');
var pool  = mysql.createPool(config.connections.mysql);
require('./chatserver')(io);
gSocket.setSocket(io);
gPool.setPool(pool);

var service = new Service({interval:1000});
service.run();
