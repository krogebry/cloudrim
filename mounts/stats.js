/**
 * This is the rift
 */

module.exports = function(app, db) {

  app.get('/stats', function(req, res){
    //var num_kaiju = db.collection( "kaijus" ).count();
    //console.log( num_kaiju );
    db.collection( "kaijus" ).find({ hp: { "$gt": 0 }}).count(function(e, num_kaiju){
      db.collection( "jaegers" ).find({ hp: { "$gt": 0 }}).count(function(e, num_jaeger){
        db.collection( "users" ).find({ xp: { "$gt": 10 }}).toArray(function(err, docs){
          //console.dir( docs );
          var body = JSON.stringify({ users: docs, kaiju: num_kaiju, jaeger: num_jaeger });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
        });
      });
    });
  });

};
