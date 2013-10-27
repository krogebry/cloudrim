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

  app.post('/jaeger', function(req, res){
    console.log( req.body );
    var jaeger = {
      hp: 100,
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
