/**
 * Jaegers
 * internal-cloudrim9-ElasticL-1JRO34B3OL2U9-676608629.us-east-1.elb.amazonaws.com
 * opsauto-dev.us-west-2.opsautohtc.net
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
  db.ensureIndex('jaegers', { hp: 1 } , { background:true, w:0 }, function(err, indexName) {});
  db.ensureIndex('jaegers', { hp: 1 } , { background:true, w:0 }, function(err, indexName) {});
});

var MAX_NUM_JAEGERS = (1024*1024*1024)*1024*1024;

var jaeger_base_chars = [
  { name: "Brawler Yukon", mark: 1, speed: 2, str: 2, armor: 3 },

  { name: "Diablo Intercept", mark: 2, speed: 5, str: 5, armor: 5 },

  { name: "Shaolin Rogue", mark: 3, speed: 7, str: 7, armor: 7 },

  { name: "Crimson Typhoon", mark: 4, speed: 10, str: 9, armor: 7 },
  { name: "Striker Eureka", mark: 5, speed: 10, str: 9, armor: 7 },

  { name: "Gipsy Danger", mark: 5, speed: 10, str: 10, armor: 10 }
];
var num_base_jaeger = jaeger_base_chars.length;

var create_jaeger = function(){
  var left_weapon = {
    ice: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    fire: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    earth: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    water: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1))
  }
  var right_weapon = {
    ice: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    fire: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    earth: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1)),
    water: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? 0 : 1))
  }

  var base_char = jaeger_base_chars[Math.floor(Math.random() * num_base_jaeger)];
  console.log( "Basename: %s", base_char.name );

  var level = parseInt((Math.random() * 10000));
  var jaeger = {
    hp: 100,
    name: "",
    level: level,
    weapons: { left: left_weapon, right: right_weapon }
  };

  db.collection( "jaegers" ).insert( jaeger, {w:-1}, function(err, docs){
    if(err){
      console.log( "Error creating Jaeger: " + err );
    }
  })
}

var update_jaegers = function(){

  var now = new Date();

  /**
  console.log( "Updating Jaegers: "+now );
  var map = function(){
    emit( this.level, 1 );
  };
  var reduce = function(key, values){
    return Array.sum(values);
  };
  db.collection( "jaegers" ).mapReduce( map, reduce, {
    out: "jaeger_level_summary",
    query: { hp: { "$gt": 0 }}
  },function(err, results){
    if(err){
      console.log( "-----------" );
      console.dir(err);
    }
  });
  */

  db.collection( "jaegers" ).count(function(err, num_jaegers){
    if(num_jaegers < MAX_NUM_JAEGERS){
      for( i=0; i<10; i++){
        create_jaeger();
      }
      console.log( "Done updating jaegers" );
      setTimeout(update_jaegers, 1000);
    }
  });

  // Update count
  /**
  db.collection( "jaegers" ).find({ hp: { "$gt": 0 }}).count(function(err, num_jaegers){
    db.collection( "summary" ).find({ name: "count_jaegers" }).count(function(err, sum){
      if(err){
        console.log( "Error getting summary count: %s", err );
      }else{
        if(sum == 0){
          db.collection( "summary" ).insert({ 
            name: "count_jaegers",
            count_jaegers: num_jaegers
          }, { w: 1 }, function(err, docs){
            if(err){
              console.log( "Error creating jaegers count: " + err );
            }
          });
  
        }else{
          db.collection( "summary" ).update({ 
            name: "count_jaegers",
          },{
            name: "count_jaegers",
            count_jaegers: num_jaegers
          }, { w: 1 }, function(err, docs){
            if(err){
              console.log( "Error creating jaegers count: " + err );
            }
          });
        }
      }
    });
  });
  */
};
setTimeout(update_jaegers, 1000);

