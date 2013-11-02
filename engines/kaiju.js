/**
 * Kaiju
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
  db.ensureIndex('user_name', { name: 1 } , { unique:true, background:true, dropDups:true, w:1 }, function(err, indexName) {});
});

var MAX_NUM_KAIJU = (1024*1)

var kaiju_base_chars = [
  { name: "Hundun", category: 1, speed: 2, str: 2, armor: 3 },

  { name: "Onibaba", category: 2, speed: 5, str: 5, armor: 5 },

  { name: "Knifehead", category: 3, speed: 7, str: 7, armor: 7 },

  { name: "Raiju", category: 4, speed: 10, str: 9, armor: 7 },
  { name: "Otachi", category: 4, speed: 10, str: 9, armor: 7 },

  { name: "Slattem", category: 5, speed: 10, str: 10, armor: 10 }
];
var num_base_kaiju = kaiju_base_chars.length;

var create_kaiju = function(){
  var ice = parseInt((Math.random() * 10) * (Math.random() >= 0.50 ? 0 : 1));
  var fire = parseInt((Math.random() * 10) * (Math.random() >= 0.50 ? 0 : 1));
  var earth = parseInt((Math.random() * 10) * (Math.random() >= 0.50 ? 0 : 1));
  var water = parseInt((Math.random() * 10) * (Math.random() >= 0.50 ? 0 : 1));

  var level = parseInt((Math.random() * 100));

  var base_char = kaiju_base_chars[Math.floor(Math.random() * num_base_kaiju)];
  console.log( "Basename: %s", base_char.name );

  var kaiju = {
    hp: 100,
    xp: 0,
    str: base_char.str,
    name: base_char.name + "" + parseInt(Math.random() * 100),
    level: level,
    armor: base_char.armor,
    speed: base_char.speed,
    bonuses: { ice: ice, fire: fire, earth: earth, water: water },
    category: base_char.category,
    actor_type: "kaiju"
  }
  db.collection( "kaijus" ).insert( kaiju, {w:-1}, function(err, docs){
    if(err){
      console.log( "Error creating kaiju: " + err );
    }
  });
}

var update_kaijus = function(){
  var now = new Date();

  console.log( "Updating Kaiju: "+now );
  var map = function(){
    emit( this.level, 1 );
  };
  var reduce = function(key, values){
    return Array.sum(values);
  };
  db.collection( "kaijus" ).mapReduce( map, reduce, {
    out: "kaiju_level_summary",
    query: { hp: { "$gt": 0 }}
  },function(err, results){
    if(err){
      console.log( "-----------" );
      console.dir(err);
    }
  });

  db.collection( "kaijus" ).count(function(err, num_kaijus){
    if(num_kaijus < MAX_NUM_KAIJU){
      for( i=0; i<10; i++){
        create_kaiju();
      }
    }
  });

  // Update count
  db.collection( "kaijus" ).find({ hp: { "$gt": 0 }}).count(function(err, num_kaijus){
    db.collection( "summary" ).find({ name: "count_kaijus" }).count(function(err, sum){
      if(err){
        console.log( "Error getting summary count: %s", err );
      }else{
        if(sum == 0){
          db.collection( "summary" ).insert({ 
            name: "count_kaijus",
            count_kaijus: num_kaijus
          }, { w: 1 }, function(err, docs){
            if(err){
              console.log( "Error creating kaijus count: " + err );
            }
          });
  
        }else{
          db.collection( "summary" ).update({ 
            name: "count_kaijus",
          },{
            name: "count_kaijus",
            count_kaijus: num_kaijus
          }, { w: 1 }, function(err, docs){
            if(err){
              console.log( "Error creating kaijus count: " + err );
            }
          });
        }
      }
    });
  });

  console.log( "Done updating kaijus" );
  setTimeout(update_kaijus, 1000);

};
setTimeout(update_kaijus, 1000);

