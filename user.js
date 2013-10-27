/**
 * Jaegers
 */

module.exports = function(app, db) {

  app.get('/user/:user_id', function(req, res){
    db.collection( "users" ).find().sort({ name: 1 }).limit( 10 ).toArray(function(err, docs) { 
      if(!err){
        var body = JSON.stringify({ data: docs });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
      }
    });
  });

  app.post('/user/register', function(req, res){
    var base = {
      name: req.body.email,
      level: req.body.key
    }
    db.collection( "users" ).insert( kaiju, {w:-1}, function(err, docs){
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
