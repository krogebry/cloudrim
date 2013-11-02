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

  app.get('/hq/arm_jaeger', function(req, res){
    db.collection( "jaegers" ).find({ weapons: undefined, hp: { "$gt": 0 }}).limit( 1 ).toArray(function(err, docs){
      var jaeger = docs[0];
      jaeger.weapons = [];
      jaeger.weapons.push({
        name: "SwoardOfIce",
        level: parseInt(Math.random() * 100),
        bonus: { fire: -5, ice: 5 }
      });
      //console.dir( jaeger );
      db.collection( "jaegers" ).update({ _id: jaeger._id }, jaeger );

      var body = JSON.stringify({ jaeger: jaeger });
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    });
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
  app.post('/hq/:hq_id/user/checkin', function(req, res){
    var hq_id = res.param( hq_id );
    var row = db.collection( "users" ).find({ _id: res.body.email });
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
