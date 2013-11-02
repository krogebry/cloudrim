/**
 * Users
 *
 *  curl -H "Content-Type: application/json" -XPOST http://localhost:9000/user -d '{"email": "bryan.kroger@gmail.com"}'
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

  app.post('/user', function(req, res){
    db.collection( "users" ).find({ name: req.body.email }).limit( 1 ).toArray(function(err, docs){
      if(err){
        res.setHeader('Content-Type', 'application/json');
        res.send( 500, {}, {} );
        return;
      }

      if(docs.length > 0){
        res.setHeader('Content-Type', 'application/json');
        res.send( 304, {}, {} );
        return;
      }

      var user = {
        xp: 10,
        name: req.body.email,
        level: 1
      };

      console.log( "Creating new user" );

      db.collection( "users" ).insert( user, {w:-1}, function(err, docs){
        if(err){
          console.log( "Error creating user: " + err );
        }else{
          console.log( "User created: " + JSON.stringify( docs ) );
          var body = JSON.stringify({ data: user});
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
        }
      });
    })
  });

};
