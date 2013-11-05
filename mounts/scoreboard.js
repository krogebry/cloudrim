/**
 * This is the rift
 */

module.exports = function(app, db) {

  app.get('/scoreboard', function(req, res){
    db.collection( "scoreboard" ).find().toArray(function(err, scoreboard){
      if(err){
        var body = JSON.stringify({ err: err });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
        return;
      }
      //console.dir( docs );

      //var scoreboard = [];
      //var body = JSON.stringify({ users: docs, kaiju: num_kaiju, jaeger: num_jaeger });
      var body = JSON.stringify(scoreboard);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    });
  });

};
