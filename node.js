/**
 * Cloudrim game
 */
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


host = "127.0.0.1";
port = 27017;


var db = new Db('cloudrim', new Server(host, port, {auto_reconnect: true}, {}), { w: -1 });
db.open(function(err, db){
  db.ensureIndex('users', { email: 1 } , { unique:true, background:true, dropDups:true, w:1 }, function(err, indexName) {});
  db.ensureIndex('kaijus', { level: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('jaegers', { level: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('battle_log', { actor_id: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('battle_log', { log_type: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('battle_log', { email: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('battle_request_log', { actor_id: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
  db.ensureIndex('battle_request_log', { request_id: 1 } , { unique:false, background:true, dropDups:false, w:1 }, function(err, indexName) {});
});

var express = require('express');
var app = express();
app.configure(function(){
  app.use(express.bodyParser());

  app.VERSION="0.0.13"

  app.use(function(req, res, next){
    //console.dir( req.body );
    //console.log('%s %s %s', req.method, req.url, req.headers.host );
    //console.log( db );
    var remote = req.headers.host.split( ":" );
    //console.log( "Remote: %s:%i" % remote[0], remote[1]);
    app.params = req.body;
    db.collection( "battle_request_log" ).insert({
      url: req.url,
      params: req.body,
      method: req.method,
      remote_host: remote[0],
      remote_port: remote[1]
    }, {w:0}, function(err, res){
      if(err){
        console.log( "Failure to insert battle request: %s", err );
      }
      //console.log( res );
    });
    next();
  });
  //console.log( req );
});

// Libs
require( "./lib/jaeger.js" )( app, db );
//require( "./lib/battle.js" )( app, db );
require( "./lib/battle.js" )( app, db );

// Pull in mounts
require( "./mounts/hq.js" )( app, db );
require( "./mounts/user.js" )( app, db );
require( "./mounts/stats.js" )( app, db );
require( "./mounts/kaiju.js" )( app, db );
require( "./mounts/jaeger.js" )( app, db );
require( "./mounts/scoreboard.js" )( app, db );

app.listen( 9000 );
console.log('Listening on port 9000');
