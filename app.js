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
var DB = require('student-queue-mysql-plugin');

function StudentQueue(config) {
    if (!(config.hasOwnProperty("host") && config.hasOwnProperty("user") &&
        config.hasOwnProperty("password") && config.hasOwnProperty("database"))) {
        throw new Error("Missing one of the required properties: host, user, password, database");
    }

    this.db = new DB({
        host: "localhost",
        user: "mnbryant_queue",
        password: "CYL88ix4stDdxpuarm86RLjf",
        database: "mnbryant_studentqueue",
        table: "config"
    });
}

StudentQueue.prototype.start = function(){
    var that = this;

    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/js", express.static(path.join(__dirname, path.join('public', 'js'))));
    app.use("/css", express.static(path.join(__dirname, path.join('public', 'css'))));

    var createConfig = db.createConfigTable();

    createConfig.then(
        function(){
            var load = db.load();

            load.then(
                function(){
                    app.use("/admin", express.static(path.join(__dirname, path.join('public', 'siteAdmin'))));

                    io.on("connection", function(socket){
                        console.log("Admin connection");
                        socket.on("addNewQueue", function(queue){
                            if (queue.hasOwnProperty("name") && queue.hasOwnProperty("password")){
                               that.db.addNewQueue(queue).then(
                                    function(){
                                        socket.emit("addedNewQueue", true);
                                    },
                                    function(err){
                                        socket.emit("addedNewQueue", false, err);
                                    }
                                );
                            }
                            else {
                                socket.emit("addedNewQueue", false, new Error("Missing either name or password"));
                            }
                        });
                    });

                    Object.keys(db.queues).forEach(function(name){
                        app.use("/" + name, express.static(path.join(__dirname, path.join('public', 'queue'))));

                        var queue =that.db.queues[name];
                        io.on('connection', function(socket){
                            console.log("Connection");

                            // Only allow teacher/aide actions if authenticated
                            socket.on('login', function(password){
                                // Validate password against hash currently stored in text file
                                var auth =that.db.validatePassword(name, password);
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
                                            io.emit('removeStudent', id);
                                        });

                                        socket.on('clearedAll', function(){
                                            queue.reset();
                                            io.emit('clearAll');
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
                                var auth =that.db.validatePassword(name, passObj.old);
                                auth.then(function(){
                                        if (passObj.new.length > 7){
                                           that.db.setHash(name, passObj.new).then(function(){
                                                    socket.emit("changePassResult", "Updated password.");
                                                },
                                                function(err){
                                                    socket.emit("changePassResult", err.toString());
                                                });

                                        }
                                        else socket.emit("changePassResult", "Update failed. Invalid password.");
                                    },
                                    function(){
                                        socket.emit("changePassResult", "Update failed.");
                                    });
                            });

                            socket.on('studentRequest', function(student){
                                console.log("Received help request");

                                queue.add(student);

                                // Send to teacher page
                                io.emit('addToQueue', student);
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