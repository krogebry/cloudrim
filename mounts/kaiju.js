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

};
