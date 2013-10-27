/**
 * This is the Jaeger HQ.
 */

module.exports = function(app, db) {

  // List bases.
  app.get('/hq/base', function(req, res){
    db.collection( "bases" ).find().sort({ name: 1 }).limit( 10 ).toArray(function(err, docs) { 
      if(!err){
        var body = JSON.stringify({ data: docs });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
      }
    });
  });

  // User check-in.
  app.post('/hq/:hq_id/user/checkin', function(req, res){
    var hq_id = res.param( hq_id );
    var row = db.collection( "user" ).find({ _id: res.body.email });
    if(row.count == 1){
      row.toArray(function(err, docs) { 
        if(err){
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.setCode( 400 );
          res.end(JSON.stringify({ err: err });
        }else{
          // do the actual check-in
          //db.collection( "user" ).update(
          var body = JSON.stringify({ data: docs });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
        }
      });
    }
  });

  app.post('/hq/bases', function(req, res){
    var base = {
      name: req.body.uuid,
      level: req.body.level
    }
    db.collection( "bases" ).insert( kaiju, {w:-1}, function(err, docs){
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

};
