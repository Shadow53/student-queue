"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var login = require('./login.js');

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

    for (var j in bathroomRequests) {
        if (bathroomRequests.hasOwnProperty(j)) {
            socket.emit('addToBathroomQueue', bathroomRequests[j]);
        }
    }

    // Only allow teacher/aide actions if authenticated
    socket.on('login', function(password){
        // Validate password against hash currently stored in text file
        var auth = login.validate(password);
        // TODO: Change so that one login can provide multiple pages based on argument?
        auth.then(
            function(){
                // Moved teacher socket handlers here so that they only work after validation
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

                // Send html for teacher page
                fs.readFile("private/teacher.html", "utf8", function(err, html){
                    // TODO: Make sure this should happen if null and not if not null
                    if (err === null) {
                        socket.emit("changePassAuth", "An error occurred. If this continues, please contact an administrator.")
                    }
                    socket.emit('loginAuth', html);
                });
            },
            function(errMsg){
                socket.emit('loginAuth', "Validation failed.\n" + errMsg);
            });
    });

    socket.on('changePass', function(passObj){
        var auth = login.validate(passObj.old);
        auth.then(function(){
            if (passObj.new.length > 7){
                var newHash = login.hashPassword(passObj.new);
                login.updatePasswordFile(newHash);
                socket.emit("changePassResult", "Updated password.");
            }
            else socket.emit("changePassResult", "Update failed.");
        },
        function(){
            socket.emit("changePassResult", "Update failed.");
        });
    });

    socket.on('studentRequest', function(student){
        console.log("Received help request");

        helpRequests[hCount] = student;
        hCount++;

        socket.emit('placement', getCorrectGrammarPlace(hCount));

        // Send to teacher page
        io.emit('addToQueue', student);
    });

    socket.on('bathroomRequest', function(student){
        console.log("Received bathroom request");

        bathroomRequests[bCount] = student;
        bCount++;

        socket.emit('placement', getCorrectGrammarPlace(bCount));

        // Send to bathroom list
        io.emit('addToBathroomQueue', student);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getCorrectGrammarPlace(num){
    var str = (""+num).slice(-1);
    switch (str){
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return num + "th";
        default:
            return num;
    }
}