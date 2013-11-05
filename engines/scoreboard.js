/**
 * Score board!
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
  //db.ensureIndex('user_name', { name: 1 } , { unique:true, background:true, dropDups:true, w:1 }, function(err, indexName) {});
});

var update_scoreboard = function(){
  var now = new Date();

  console.log( "Updating Scoreboard: "+now );

  var map = function(){
    emit(this.email, this.xp);
  };
  var reduce = function(key, values){
    return Array.sum(values);
  };
  db.collection( "battle_log" ).mapReduce( map, reduce, {
    out: "scoreboard",
    query: {
      log_type: "xp_award"
    } 
  },function(err, results){
    if(err){
      console.log( "-----------" );
      console.dir(err);
      return;
    }

    var map = function(){
      emit(this.remote_host, 1);
    };
    var reduce = function(key, values){
      return Array.sum(values);
    };
    db.collection( "battle_request_log" ).mapReduce( map, reduce, {
      out: "request_summary",
      query: { } 
    },function(err, results){
      if(err){
        console.log( "-----------" );
        console.dir(err);
        return;
      }
      console.log( "Done updating scoreboard" );

      // Run again *after* this is complete.
      setTimeout(update_scoreboard, 1000);
    });

  });

};
setTimeout(update_scoreboard, 1000);

