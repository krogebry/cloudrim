/**
 * This is the rift
 */
var express = require('express');
//var app = express();

var app = express();

app.configure(function(){
  app.use(express.bodyParser());
});

/**
var MongoClient = require('mongodb').MongoClient;
var db = MongoClient.connect("mongodb://localhost:27017/cloudrim", function(err, db) {
  if(err) {
    console.log("Failed to connect");
    exit();
  }
});
console.log( db );
*/

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

host = "127.0.0.1"
port = 27017

var db = new Db('cloudrim', new Server(host, port, {auto_reconnect: true}, {}), { w: -1 });
db.open(function(){});

app.get('/kaiju', function(req, res){
  db.collection( "kaiju" ).find().toArray(function(err, docs) { 
    if(!err){
      var body = JSON.stringify({ data: docs });
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    }
  });
});

app.post('/kaiju', function(req, res){
  var kaiju = {
    name: req.body.uuid,
    level: req.body.level
  }
  db.collection( "kaiju" ).insert( kaiju, {w:-1}, function(err, docs){
    if(err){
      console.log( "Error creating kaiju: " + err );
    }else{
      console.log( "Kijui created: " + JSON.stringify( docs ) );
      var body = JSON.stringify({ data: kaiju});
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    }
  });
});

app.listen( 9000 );
console.log('Listening on port 9000');
