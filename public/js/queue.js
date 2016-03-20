"use strict";
$(document).ready(function(){
    //var socket = io();
    var pathArr = document.location.pathname.split("/");
    var index = pathArr.indexOf("teacher", pathArr.length - 3);
    if (index === -1 ){
        throw new Error("Die: Cannot parse the path.");
    }

    var room = pathArr[index - 1];
    var socket = io("/" + room.toLowerCase());

    login(socket).done(function(){
        var canNotify = askToNotify("alert you to new student requests while you are away from this page.");

        socket.on('addToQueue', function(student){

            // Check if student is in list already
            if ($('#'+student.id+"Help").length > 0){
                return false;
            }
            else {
                var elem = $('<div></div>', {
                    id: student.id + "Help",
                    class: "large-12 medium-12 small-12 queue-item",
                    text: student.name + " -- " + student.problem
                });
                $('#studentQueue').append(elem);
                $(elem).click(function(e){
                    $(this).remove();
                    socket.emit('removeRequest', "#" + student.id + "Help");
                });
                if (canNotify) {
                    new Notification("HELP REQUEST\n" + student.name + ":\n" + student.problem);
                }
            }
        });

        socket.on('removeStudent', function (id){
            $(id).remove();
        });

        socket.on('clearAll', function(){
            $("#studentQueue .queue-item").remove();
        });

        $("#studentClear").click(function(e){
            console.log("Cleared queue");
            $("#studentQueue .queue-item").remove();
            socket.emit('clearedAll');
        });

        window.addEventListener('beforeunload', function(e){
            var msg = "Do you want to leave the page?";
            e.returnValue = msg;
            return msg;
        });

        window.addEventListener("unload", function(e){
            socket.close();
        });
    });
});
