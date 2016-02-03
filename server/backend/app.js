"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var helpRequests = {};
var hCount = 0;
var bathroomRequests = {};
var bCount = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log("Connection");

  for (var i in helpRequests) {
    if (helpRequests.hasOwnProperty(i)) {
      socket.emit('addToQueue', helpRequests[i]);
    }
  }

  for (var i in bathroomRequests) {
    if (bathroomRequests.hasOwnProperty(i)) {
      socket.emit('addToBathroomQueue', bathroomRequests[i]);
    }
  }

  socket.on('studentRequest', function(student){
    console.log("Received help request");

    helpRequests[hCount] = student;
    hCount++;

    // Send to teacher page
    io.emit('addToQueue', student);
  });

  socket.on('bathroomRequest', function(student){
    console.log("Received bathroom request");

    bathroomRequests[bCount] = student;
    bCount++;

    // Send to bathroom list
    io.emit('addToBathroomQueue', student);
  });

  socket.on('removeRequest', function(id){
    var realId = id.slice(1,7);
    var type = id.slice(7);
    if (type === "Help"){
      for (var i in helpRequests) {
        if (helpRequests.hasOwnProperty(i)) {
          if (helpRequests[i].id === realId){
            delete helpRequests[i];
            break;
          }
        }
      }
    }
    else if (type === "Bathroom"){
      for (var i in bathroomRequests) {
        if (bathroomRequests.hasOwnProperty(i)) {
          if (bathroomRequests[i].id === realId){
            delete bathroomRequests[i];
            break;
          }
        }
      }
    }
    else {
      console.log("Could not remove request from object");
    }
    console.log("Student with id " + id + " was resolved");
    io.emit('removeStudent', id);
  });

  socket.on('clearedAllHelp', function(){
    helpRequests = {};
    hCount = 0;
    io.emit('clearAllHelp');
  });

  socket.on('clearedAllBathroom', function(){
    bathroomRequests = {};
    bCount = 0;
    io.emit('clearAllBathroom');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});