/**
 * Cloudrim game
 */

var express = require('express');
var app = express();
app.configure(function(){
  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url );
    next();
  });
  app.use(express.bodyParser());
});

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

host = "127.0.0.1"
port = 27017

var db = new Db('cloudrim', new Server(host, port, {auto_reconnect: true}, {}), { w: -1 });
db.open(function(){});

require( "./kaiju.js" )( app, db );
require( "./hq.js" )( app, db );
require( "./user.js" )( app, db );
require( "./jaeger.js" )( app, db );

app.listen( 9000 );
console.log('Listening on port 9000');
