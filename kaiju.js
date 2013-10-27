/**
 * This is the rift
 */

module.exports = function(app, db) {

  app.get('/kaiju', function(req, res){
    db.collection( "kaijus" ).find().sort({ name: 1 }).limit( 10 ).toArray(function(err, docs) { 
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
      hp: 100,
      name: req.body.name,
      level: req.body.level
    }
    db.collection( "kaijus" ).insert( kaiju, {w:-1}, function(err, docs){
      if(err){
        console.log( "Error creating kaiju: " + err );
      }else{
        console.log( "Kijui created: " + JSON.stringify( docs ) );
        var body = JSON.stringify({ kaiju: kaiju });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
      }
    });
  });

};
