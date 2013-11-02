/**
 * Run all the engines!!
 *
 */
 
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

host = "127.0.0.1"
port = 27017

var db = new Db('cloudrim', new Server(host, port, {auto_reconnect: true}, {}), { w: -1 });
db.open(function(err, db){
  db.ensureIndex('user_name', { name: 1 } , { unique:true, background:true, dropDups:true, w:1 }, function(err, indexName) {});
});

require( "./engines/kaiju.js" )( db );
require( "./engines/jaegers.js" )( db );


