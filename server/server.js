var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(bodyParser.json());

//Sockets
var initialLog = [];
var http = require('http').Server(app);

//Basic web server
initialLog.push('Web server active');
app.use('/', express.static(__dirname + "/../public"));
//Respond with index.html regardless of request
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});


//Start listening
http.listen(28882, function() {
  initialLog.push('Listening on port 28882 ...');
  console.log('start', initialLog.join(', '));
});
