var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  console.log("Location:");
  console.log(__dirname);
  res.sendFile(__dirname + '/frontend/index.html');
});

io.on('connection', function(socket){
  console.log("Connection");
  socket.on('addToQueue', function(msg){
    console.log("Sending message");
    io.emit('addToQueue', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
