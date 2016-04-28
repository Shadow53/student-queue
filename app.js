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
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

function StudentQueue(config) {
    if (!(config.hasOwnProperty("host") && config.hasOwnProperty("user") &&
        config.hasOwnProperty("password") && config.hasOwnProperty("database"))) {
        throw new Error("Missing one of the required properties: host, user, password, database");
    }

    if (config.hasOwnProperty("cookieSecret"))
        this.secret = config.cookieSecret;

    this.port = config.hasOwnProperty("port") ? config.port : 3000;

    this.db = new DB(config);
}

StudentQueue.prototype.start = function(){
    var that = this;

    app.use(cookieParser(this.secret !== undefined ? this.secret : "ThisIsMyDefaultSecret"));
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/js", express.static(path.join(__dirname, path.join('public', 'js'))));
    app.use("/css", express.static(path.join(__dirname, path.join('public', 'css'))));

    var createConfig = that.db.createConfigTable();

    createConfig.then(
        function(){
            var load = that.db.load();

            load.then(
                function(){
                    app.post("*/login", function(req, res){
                        var path = req.path;
                        var name = path.slice(1, path.slice(0, path.slice(0, -1).lastIndexOf("/")).length);
                        if (name.indexOf("/") > -1) name = name.slice(0, name.lastIndexOf("/"));
                        var auth = that.db.validatePassword(name, req.body.password);
                        auth.then(
                            function(){
                                res.cookie("admin", "true", {
                                    path: path.slice(0, path.lastIndexOf("/login")),
                                    maxAge: 86400000, // One day
                                    //secure: true,
                                    //signed: true
                                });
                                //res.append('Set-Cookie', 'admin=true; Path=/; HttpOnly; maxAge=86400000');

                                res.redirect("back");
                                //res.status(200).send();
                            },
                            function(err){
                                res.status(403).end();
                            }
                        );
                    });

                    app.post("*/logout", function(req, res){
                        var path = req.path;

                        res.clearCookie("admin", { path: path.slice(0, path.lastIndexOf("/logout")) });
                        //res.append('Set-Cookie', 'admin=true; Path=/; HttpOnly; maxAge=86400000');

                        res.redirect("back");
                        //res.status(200).send();
                    });
                    
                    app.get("/admin", function(req, res){
                        if (req.cookies.admin === "true")
                            res.sendFile(path.join(__dirname, path.join('public', path.join('siteAdmin', 'index.html'))));
                        else {
                            res.sendFile(path.join(__dirname, path.join('public', 'login.html')));
                        }
                    });

                    /*app.post("/admin/login", function(req, res){
                        var auth = that.db.validatePassword("admin", req.body.password);
                        auth.then(
                            function(){
                                res.cookie("admin", "true", {
                                    path: "/admin",
                                    maxAge: 86400000, // One day
                                    //secure: true,
                                    //signed: true
                                });
                                //res.append('Set-Cookie', 'admin=true; Path=/; HttpOnly; maxAge=86400000');

                                res.sendStatus(200);
                            },
                            function(err){
                                res.status(403).end();
                            }
                        );
                    });*/

                    app.get("/admin/queues", function(req, res){
                        if (req.cookies.admin === "true"){
                            that.db.getAllQueues().then(
                                function(result){
                                    res.json(result);
                                },
                                function(err){
                                    res.status(500).end();
                                }
                            )
                        }
                        else res.status(403).end();
                    });

                    app.post("/admin/queues", function(req, res){
                        if (req.cookies.admin === "true"){
                            if (Object.prototype.hasOwnProperty.call(req.body, "newName") &&
                                Object.prototype.hasOwnProperty.call(req.body, "pass1") &&
                                Object.prototype.hasOwnProperty.call(req.body, "pass2") &&
                                req.body.pass1 === req.body.pass2) {
                                var queue = {};
                                queue.name = req.body.newName.toLowerCase();
                                queue.password = req.body.pass1;

                                that.db.addNewQueue(queue).then(
                                    function(){
                                        initQueue(queue.name);
                                        res.redirect("/admin");
                                    },
                                    function(err){
                                        res.status(500).end();
                                    }
                                );
                            }
                            else res.status(400).end();
                        }
                        else res.status(403).end();
                    });

                    /*
                    // Putting this here for later
                    app.put("/admin/queues", function(req, res){
                        // Update existing queue here
                    });
                     */

                    app.delete("/admin/queues", function(req, res){
                        if (req.cookies.admin === "true"){
                            var name = req.body.name.toLowerCase();
                            if (that.db.queues.hasOwnProperty(name)){
                                that.db.deleteQueue(name).then(
                                    function(){
                                        delete io.nsps["/" + name];
                                        // The app stack has a "path" property that *should* contain the path name,
                                        // e.g. "/example", however most of the time it is undefined. Instead,
                                        // do pattern matching on the regex - how ironic.
                                        var stack = app._router.stack;
                                        for(var i = 0; i < stack.length; i++){
                                            // This assumption is made because the name is alphanumeric only
                                            switch (stack[i].regexp.toString()){
                                                case "/^\\/" + name + "\\/?$/i":
                                                case "/^\\/" + name + "\\/teacher\\/?$/i":
                                                case "/^\\/" + name + "\\/student\\/?$/i":
                                                case "/^\\/" + name + "\\/teacher\\/login\\/?$/i":
                                                    console.log("Matched" + stack[i].regexp.toString());
                                                    stack.splice(i, 1);
                                                    i--;
                                            }
                                        }
                                        res.status(204).end();
                                    },
                                    function(err){
                                        res.status(500).end();
                                    }
                                );
                            }
                            else res.status(404).end();
                        }
                        else res.status(403).end();
                    });

                    app.post("/admin", function(req, res){
                        if (req.cookies.admin === "true"){
                            var auth = that.db.validatePassword("admin", req.body.old)
                            auth.then(
                                function(){
                                    var newPassword = req.body.newpassword;
                                    if (newPassword.length > 7){
                                        that.db.setHash("admin", newPassword).then(
                                            function(){
                                                res.clearCookie("admin", {path: req.path});
                                                res.redirect("back");
                                            },
                                            function(err){
                                                res.status(500).end();
                                            });

                                    }
                                    else res.status(400).end();
                                },
                                function(){
                                    res.status(400).end();
                                }
                            )

                        }
                        else res.status(403).end();
                    });

                    //app.use("/admin", express.static(path.join(__dirname, path.join('public', 'admin'))));

                    Object.keys(that.db.queues).forEach(initQueue);
                    console.log("Done loading program")
                }
            );
        }
    );

    function initQueue(name) {
        var queue = that.db.queues[name];
        var room = io.of("/" + name);
        room.on('connection', function (socket) {
            console.log("Connection");

            // I think I can assume that, if someone is on the teacher page, they are allowed to view it,
            // So extra checks aren't necessary
            socket.on('removeRequest', function (id) {
                var realId = id.slice(1, 7);
                var type = id.slice(7);
                if (type === "Help") {
                    queue.remove(realId).then(
                        function () {
                            console.log("Successfully removed request from " + realId);
                        },
                        function (err) {
                            console.log(err)
                        }
                    );
                }
                else {
                    console.log("Could not remove request from database");
                }
                console.log("Student with id " + id + " was resolved");
                room.emit('removeStudent', id);
            });

            socket.on('clearedAll', function () {
                queue.reset();
                room.emit('clearAll');
            });

            var getRequests = queue.getAll();
            getRequests.then(
                function (requests) {
                    requests.forEach(function (req, i, arr) {
                        socket.emit("addToQueue", {
                            id: req.studentid,
                            name: req.name,
                            problem: req.description
                        });
                    });
                },
                function (err) {
                    console.log(err);
                }
            );

            socket.on('studentRequest', function (student) {
                console.log("Received help request");

                queue.add(student);

                // Send to teacher page
                room.emit('addToQueue', student);
            });
        });
        name = name.toLowerCase();
        app.get("/"+name+"/teacher", function(req, res){
            if (req.cookies.admin === "true"){
                res.sendFile(path.join(__dirname, path.join('public', path.join('queue', path.join('teacher', 'index.html')))));
            }
            else {
                res.sendFile(path.join(__dirname, path.join('public', 'login.html')));
            }
        });
        app.get("/"+name+"/student", function(req, res){
            res.sendFile(path.join(__dirname, path.join('public', path.join('queue', path.join('student', 'index.html')))));
        });
        app.get("/" + name, function(req, res){
            res.sendFile(path.join(__dirname, path.join('public', path.join('queue', 'index.html'))));
        });
    }

    // Put this here because the program will use this path last:
    app.use(express.static(path.join(__dirname, path.join('public', 'home'))))

    http.listen(this.port, function(){
        console.log('listening on *:' + this.port);
    });
};

module.exports = StudentQueue;