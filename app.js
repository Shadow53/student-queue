/**
 * Created by michael on 3/9/16.
 */
"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var DB = require('student-queue-mariadb-plugin');

function StudentQueue(config) {
    if (!(config.hasOwnProperty("host") && config.hasOwnProperty("user") &&
        config.hasOwnProperty("password") && config.hasOwnProperty("db"))) {
        throw new Error("Missing one of the required properties: host, user, password, db");
    }

    this.db = new DB(config);
}

StudentQueue.prototype.start = function(){
    var that = this;

    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/js", express.static(path.join(__dirname, path.join('public', 'js'))));
    app.use("/css", express.static(path.join(__dirname, path.join('public', 'css'))));

    var createConfig = that.db.createConfigTable();

    createConfig.then(
        function(){
            var load = that.db.load();

            load.then(
                function(){
                    app.use("/admin", express.static(path.join(__dirname, path.join('public', 'siteAdmin'))));

                    var admin = io.of("/admin");
                    admin.on("connection", function(socket){
                        console.log("Admin connection");
                        socket.on("addNewQueue", function(queue){
                            if (queue.hasOwnProperty("name") && queue.hasOwnProperty("password")){
                               that.db.addNewQueue(queue).then(
                                    function(){
                                        socket.emit("addedNewQueue");
                                    },
                                    function(err){
                                        socket.emit("addedNewQueue", err);
                                    }
                                );
                            }
                            else {
                                socket.emit("addedNewQueue", new Error("Missing either name or password"));
                            }
                        });
                        
                        socket.on("getAllQueues", function(){
                            that.db.getAllQueues().then(
                                function(result){
                                    socket.emit("giveAllQueues", null, result);
                                },
                                function(err){
                                    socket.emit("giveAllQueues", err);
                                }
                            )
                        });

                        socket.on("deleteQueue", function(name){
                           if (that.db.queues.hasOwnProperty(name)){
                               that.db.deleteQueue(name).then(
                                   function(){
                                       socket.emit("deletedQueue");
                                   },
                                   function(err){
                                       socket.emit("deletedQueue", err);
                                   }
                               );
                           }
                           else {
                               socket.emit("deletedQueue", new Error("Queue with name " + name + " does not exist"));
                           }
                        });
                    });

                    Object.keys(that.db.queues).forEach(function(name){
                        app.use("/" + name.toLowerCase(), express.static(path.join(__dirname, path.join('public', 'queue'))));

                        var queue = that.db.queues[name];
                        var room = io.of("/" + name.toLowerCase());
                        room.on('connection', function(socket){
                            console.log("Connection");

                            // Only allow teacher/aide actions if authenticated
                            socket.on('login', function(password){
                                // Validate password against hash currently stored in text file
                                var auth = that.db.validatePassword(name, password);
                                // TODO: Change so that one login can provide multiple pages based on argument?
                                auth.then(
                                    function(){
                                        // Moved teacher socket handlers here so that they only work after validation
                                        socket.on('removeRequest', function(id){
                                            var realId = id.slice(1,7);
                                            var type = id.slice(7);
                                            if (type === "Help"){
                                                queue.remove(realId).then(
                                                    function(){
                                                        console.log("Successfully removed request from " + realId);
                                                    },
                                                    function(err){console.log(err)}
                                                );
                                            }
                                            else {
                                                console.log("Could not remove request from database");
                                            }
                                            console.log("Student with id " + id + " was resolved");
                                            room.emit('removeStudent', id);
                                        });

                                        socket.on('clearedAll', function(){
                                            queue.reset();
                                            room.emit('clearAll');
                                        });

                                        socket.emit('loginAuth', true);

                                        var getRequests = queue.getAll();
                                        getRequests.then(
                                            function(requests){
                                                requests.forEach(function(req, i, arr){
                                                    socket.emit("addToQueue", {id: req.studentid, name:req.name, problem: req.description}) ;
                                                });
                                            },
                                            function(err){
                                                console.log(err);
                                            }
                                        );
                                    },
                                    function(errMsg){
                                        socket.emit('loginAuth', false);
                                    });
                            });

                            socket.on('changePass', function(passObj){
                                var auth = that.db.validatePassword(name, passObj.old);
                                auth.then(function(){
                                        if (passObj.new.length > 7){
                                           that.db.setHash(name, passObj.new).then(function(){
                                                    socket.emit("changePassResult", "Updated password.");
                                                },
                                                function(err){
                                                    socket.emit("changePassResult", err.toString());
                                                });

                                        }
                                        else socket.emit("changePassResult", "Update failed. Invalid password. Must be at least 8 characters long");
                                    },
                                    function(){
                                        socket.emit("changePassResult", "Update failed.");
                                    });
                            });

                            socket.on('studentRequest', function(student){
                                console.log("Received help request");

                                queue.add(student);

                                // Send to teacher page
                                room.emit('addToQueue', student);
                            });
                        });
                    });
                }
            );
        }
    );

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
};

module.exports = StudentQueue;