/**
 * This is the Jaeger HQ.
 */

module.exports = function(app, db) {

  app.get('/hq/version', function(req, res){
    var body = JSON.stringify({ version: app.VERSION });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', body.length);
    res.end(body);
  });

  app.post('/hq/battle', function(req, res){
    //console.log( req.body );

    // Get a random jaeger
    //db.collection( "jaegers" ).find({ name: { "$ne": null }, hp: { "$gt": 0 }}).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
    db.collection( "jaegers" ).find({ 
      hp: { "$gt": 0 }
    }).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
      if(err){
        console.log( "Error: %s", err );
        return;
      }

      var jaeger = docs[0];
      if(docs.length == 0){
          //console.log( "Unable to find any jaegers!" );
          var body = JSON.stringify({ err: "Unable to find any jaegers" });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
          return;
      }
      //console.dir( jaeger );
    
        // Get a random kaiju
        //console.log( Math.random() );
        //db.collection( "kaijus" ).find({ hp: { "$gt": 0 } }).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
        db.collection( "kaijus" ).find({ hp: { "$gt": 0 } }).skip( Math.random()*10 ).limit( 1 ).toArray(function(err, docs){
          //console.log( docs.length );
          if(docs.length > 0){
            kaiju = docs[0];

            //console.dir( kaiju );
            //console.dir( jaeger );

            app.fight_battle(jaeger, kaiju);

            //console.dir( kaiju );
            //console.dir( jaeger );

            db.collection( "kaijus" ).update({ _id: kaiju._id }, kaiju );
            db.collection( "jaegers" ).update({ _id: jaeger._id }, jaeger );

            if(app.params != undefined && app.params.email != null){
              db.collection( "users" ).find({ name: req.body.email }).toArray(function(err, docs){
                if(docs.length == 1){
                  var user = docs[0];
                  var xp_award = parseInt(Math.random() * 10);
                  user.xp += xp_award;

                  db.collection( "battle_log" ).insert({
                    xp: xp_award,
                    email: app.params.email,
                    log_type: "xp_award",
                    actor_id: jaeger._id,
                    actor_name: jaeger.name
                  }, {w:0}, function(err, res){
                    //console.log( "Battle xp award log created." );
                  });

                  //console.dir( user );
                  db.collection( "users" ).update({ _id: user._id }, user);
                }
              });
            }

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
    });
  });

  // User check-in.
  app.post('/hq/checkin', function(req, res){
    db.collection( "users" ).find({ email: app.params.email }).toArray(function(err, doc){
        if(err){
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.setCode( 400 );
          res.end(JSON.stringify({ err: err }));

        }else{
          if(doc.length == 0){
            db.collection( "users" ).insert({ name: app.params.email, level: 1, xp: 10, email: app.params.email }, {w:0}, function(err, doc){
              var body = JSON.stringify({ email: app.params.email }); 
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Content-Length', body.length);
              res.end(body);
            });

          }else{
            db.collection( "users" ).update({ _id: doc[0]["_id"] }, doc[0], {w:0}, function(err, doc){
              var body = JSON.stringify({}); 
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Content-Length', body.length);
              res.end(body);
            });

          }
        }
    });
  });

};
