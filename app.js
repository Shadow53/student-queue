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
var ErrorPage = require("./server/error-page.js");
var TeacherPage = require("./server/teacher-page.js");
var StudentPage = require("./server/student-page.js");
var QueueHomePage = require("./server/queue-home-page.js");
var QueueAdminPage = require("./server/queue-admin-page.js");
var SiteAdminPage = require("./server/site-admin-page.js");
var SiteHomePage = require("./server/site-home-page.js");
var LoginPage = require("./server/login-page.js");

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
                                //res.status(401).end();
                                res.send((new ErrorPage(401, "You entered the wrong password.", true)).html);
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
                            res.send(new SiteAdminPage().html);
                        else {
                            res.send(new LoginPage(req.originalUrl,"site admin").html);
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
                        that.db.getAllQueues().then(
                            function(result){
                                res.json(result);
                            },
                            function(err){
                                res.status(500).end();
                            }
                        );
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
                                queue.description = req.body.desc;

                                that.db.addNewQueue(queue).then(
                                    function(){
                                        initQueue(queue.name);
                                        res.redirect("back");
                                    },
                                    function(err){
                                        res.send((new ErrorPage(500, err.message, true)).html);
                                    }
                                );
                            }
                            else res.status(400).end();
                        }
                        else res.status(403).end();
                    });

                    // Putting this here for later
                    app.put("/admin/queues", function(req, res){
                        if (req.cookies.admin === "true") {
                            var name = req.body.name.toLowerCase();
                            if (that.db.queues.hasOwnProperty(name)) {
                                that.db.setDescription(name, req.body.description).then(
                                    function(){
                                        if (Object.prototype.hasOwnProperty.call(req.body, "password") &&
                                            req.body.password !== "") {
                                            that.db.setHash(name, req.body.password).then(
                                                function(){
                                                    res.status(200).end();
                                                },
                                                function(err){
                                                    // Is it a user error?
                                                    // This should be checked before, but who knows?
                                                    if (err.indexOf("Missing one of the required arguments:") > -1) {
                                                        res.status(400).end();
                                                    }
                                                    // Else probably a DB error
                                                    else res.send(500).end();
                                                }
                                            );
                                        }
                                        else res.status(200).end();
                                    },
                                    function(err){
                                        // Is it a user error?
                                        // This should be checked before, but who knows?
                                        if (err.indexOf("Missing one of the required arguments:") > -1) {
                                            res.status(400).end();
                                        }
                                        // Else probably a DB error
                                        else res.status(500).end()
                                    }
                                );
                            }
                            else res.status(400).end()
                        }
                        else res.status(403).end();
                    });

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

            // Put this here because the program will use this path last:
            app.get("/", function(req, res){
                res.send(new SiteHomePage().html);
            });
        },
        function (err) {
            console.error(err);
            app.get("*", function(req, res){
                res.send(new ErrorPage(500, err.message, false).html);
            });
        }
    );

    function initQueue(name) {
        name = name.toLowerCase();
        var room = io.of("/" + name);
        room.on('connection', function (socket) {
            console.log("Connection");
            var queue = that.db.queues[name];
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

        app.get("/"+name+"/teacher", function(req, res){
            if (req.cookies.admin === "true"){
                res.send(new TeacherPage(name).html);
            }
            else {
                res.send(new LoginPage(req.originalUrl,"teacher").html);
            }
        });
        app.get("/"+name+"/student", function(req, res){
            res.send(new StudentPage(name).html);
        });
        app.get("/" + name, function(req, res){
            res.send(new QueueHomePage(name).html);
        });
        app.get("/" + name + "/admin", function(req, res){
            if (req.cookies.admin === "true"){
                res.send(new QueueAdminPage(name).html);
            }
            else {
                res.send(new LoginPage(req.originalUrl,"queue admin").html);
            }
        });
    }

    http.listen(this.port, function(){
        console.log('listening on *:' + this.port);
    });
};

module.exports = StudentQueue;