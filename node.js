/**
 * Cloudrim game
 */
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/cloudrim", function(err, db) {
  if(err) {
    console.log("Failed to connect");
  }
});

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(9000, '0.0.0.0');

console.log('Server running at http://127.0.0.1:1337/');
