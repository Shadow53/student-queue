"use strict";
$(document).ready(function(){
    var socket = io();
    socket.on('addToQueue', function(student){

        // Check if student is in list already
        if ($('#'+student.id+"Help").length > 0){
            return false;
        }
        else {
            var elem = $('<div></div>', {
                id: student.id + "Help",
                class: "queue-item",
                text: student.name + " -- " + student.problem
            });
            $('#studentQueue').append(elem);
            $(elem).click(function(e){
                $(this).remove();
                socket.emit('removeRequest', "#" + student.id + "Help");
            })
        }
    });

    socket.on('addToBathroomQueue', function(student){

        // Check if student is in list already
        if ($('#'+student.id+"Bathroom").length > 0){
            return false;
        }
        else {
            var time = new Date(student.time);
            var hours = time.getHours();
            if (hours > 12){
                hours -= 12;
            }

            if (hours < 10){
                hours = "0"+hours.toString();
            }
            var stringTime = hours + ":" + time.getMinutes();

            var elem = $('<div></div>', {
                id: student.id + "Bathroom",
                class: "queue-item",
                text: student.name + " -- " + stringTime
            });
            $('#bathroomQueue').append(elem);
            $(elem).click(function(e){
                $(this).remove();
                socket.emit('removeRequest', "#" + student.id + "Bathroom");
            })
        }
    });

    socket.on('removeStudent', function (id){
        $(id).remove();
    });

    socket.on('clearAllHelp', function(){
        $("#studentQueue .queue-item").remove();
    });

    socket.on('clearAllBathroom', function(){
        $("#bathroomQueue .queue-item").remove();
    });

    $("#studentClear").click(function(e){
        console.log("Cleared queue");
        $("#studentQueue .queue-item").remove();
        socket.emit('clearedAllHelp');
    });

    $("#bathroomClear").click(function(e){
        console.log("Cleared queue");
        $("#bathroomQueue .queue-item").remove();
        socket.emit('clearedAllBathroom');
    });

    window.addEventListener('beforeunload', function(e){
        var msg = "Do you want to leave the page?";
        e.returnValue = msg;
        return msg;
    });

    window.addEventListener("unload", function(e){
        socket.close();
    });

    /*$(".queue-item").click(function(e){
     $(this).remove();
     })*/
});