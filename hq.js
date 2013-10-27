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

  app.get('/hq/deploy_jaeger', function(req, res){
    // Get a random jaeger
    db.collection( "jaegers" ).find({ name: { "$ne": null }, hp: { "$gt": 0 }}).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
      if(!err){
        var jaeger = docs[0];
        //console.log( jaeger );
    
        // Get a random kaiju
        //console.log( Math.random() );
        db.collection( "kaiju" ).find({ hp: { "$gt": 0 }, name: { "$nin": [null, "blah"] }}).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
          //console.log( docs.length );
          if(docs.length > 0){
            kaiju = docs[0];
            //console.log( kaiju );

            // Who hits first?
            var jaeger_test = Math.random();
            var kaiju_test = Math.random();

            if(jaeger_test > kaiju_test){ // Jaeger hit's first.
              var hit = (Math.random()*10)
              var luck = Math.random();
              if(luck >= 0.90){
                console.log( "%s(%s) got a lucky hit on %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit )
                hit += (hit*2);
              else if(luck >= 0.50 && luck < 0.90){
                console.log( "%s(%s) got a good hit on %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit )
                hit += (hit*0.20);
              else{ // You are not lucky.
                console.log( "%s(%s) hit %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit )
              }
              kaiju.hp -= hit;

              // The response is a standard hit.
              var hit = (Math.random()*10)
              jaeger.hp -= hit;

            }else{  // Kaiju hit's first.
              var hit = (Math.random()*10)
              var luck = Math.random();
              if(luck >= 0.90){
                console.log( "%s(%s) got a lucky hit on %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit )
                hit += (hit*2);
              else if(luck >= 0.50 && luck < 0.90){
                console.log( "%s(%s) got a good hit on %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit )
                hit += (hit*0.20);
              else{ // You are not lucky.
                console.log( "%s(%s) hit %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit )
              }
              jaeger.hp -= hit;

              // The response is a standard hit.
              var hit = (Math.random()*10)
              kaiju.hp -= hit;
              console.log( "%s(%s) hit back %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit )
            }

            db.collection( "kaiju" ).update({ _id: kaiju._id }, kaiju );
            db.collection( "jaeger" ).update({ _id: jaeger._id }, jaeger );

            var body = JSON.stringify({ kaiju: kaiju, jaeger: jaeger });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', body.length);
            res.end(body);

          }else{
            console.log( "Unable to find kaiju to fight!" );
            var body = JSON.stringify({ err: "Unable to find kaiju to fight!" });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', body.length);
            res.end(body);

          }
        });
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
          res.end(JSON.stringify({ err: err }));
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
