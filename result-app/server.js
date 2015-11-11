var express = require('express'),
    redis = require("redis"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    io = require('socket.io').listen(app),
    app = express();

io.set('origins', '*:*');

var port = process.env.PORT || 4000;
var password = process.env.REDIS_ENV_REDIS_PASS;
var options = {
  "host": "redis",
  "port":"6379",
  "auth_pass": password
};

var client = redis.createClient(options);

client.on("error", function (err) {
    console.log("Error " + err);
});

io.sockets.on('connection', function (socket) {
  socket.emit('message', { text : 'Welcome!' });
});

client.on("ready", function(){
  client.subscribe("pubsub");
});

client.on("message", function(channel, message){
  io.sockets.emit("scores", message);
});

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App running on port ' + port);
});
