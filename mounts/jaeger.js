/**
 * Jaegers
 * internal-cloudrim9-ElasticL-1JRO34B3OL2U9-676608629.us-east-1.elb.amazonaws.com
 * opsauto-dev.us-west-2.opsautohtc.net
 */

module.exports = function(app, db) {

  app.post('/jaeger', function(req, res){
      var left_weapon = {
        ice: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        fire: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        earth: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        water: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1))
      }
      var right_weapon = {
        ice: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        fire: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        earth: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1)),
        water: parseInt((Math.random() * 10) * (Math.random() >= 0.90 ? -1 : 1))
      }
      var level = parseInt((Math.random() * 100));
      var jaeger = {
        hp: 100,
        name: req.body.name,
        level: level,
        weapons: { left: left_weapon, right: right_weapon }
      };
      db.collection( "jaegers" ).insert( jaeger, {w:-1}, function(err, docs){
        if(err){
          console.log( "Error creating Jaeger: " + err );
        }else{
          //console.log( "Jaeger created: " + JSON.stringify( docs ) );
          var body = JSON.stringify({ data: jaeger });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Length', body.length);
          res.end(body);
        }
      })
  });

  /**
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
  */

  app.get('/jaeger/summary', function(req, res){
    db.collection( "summary" ).find({ name: "count_jaegers" }).toArray(function(err, docs) {
      var body = JSON.stringify({ data: docs[0]});
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    });;
  });


};
