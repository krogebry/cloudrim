/**
 * Jaegers
 * internal-cloudrim9-ElasticL-1JRO34B3OL2U9-676608629.us-east-1.elb.amazonaws.com
 * opsauto-dev.us-west-2.opsautohtc.net
 */

module.exports = function(app, db) {

  app.get('/jaeger', function(req, res){
    db.collection( "jaegers" ).find().sort({ name: 1 }).limit( 10 ).toArray(function(err, docs) { 
      if(!err){
        var body = JSON.stringify({ data: docs });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
      }
    });
  });

  app.get('/jaeger/start_random_battle', function(req, res){
    // Get a random jaeger
    db.collection( "jaegers" ).find({ name: { "$ne": null }}).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, jaeger){
      if(!err){
        //console.log( jaeger );

        // Get a random kaiju
        //console.log( Math.random() );
        db.collection( "kaiju" ).find({ name: { "$nin": [null, "blah"] }}).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, kaiju){
          //console.log( kaiju );
          var body = JSON.stringify({ kaiju: kaiju, jaeger: jaeger });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
        });
      }
    });
  });

  app.post('/jaeger', function(req, res){
    console.log( req.body );
    var jaeger = {
      name: req.body.name,
      level: req.body.level
    };
    //console.log( jaeger );

    db.collection( "jaegers" ).insert( jaeger, {w:-1}, function(err, docs){
      if(err){
        console.log( "Error creating Jaeger: " + err );
      }else{
        console.log( "Jaeger created: " + JSON.stringify( docs ) );
        var body = JSON.stringify({ data: jaeger });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
      }
    });
  });

};
