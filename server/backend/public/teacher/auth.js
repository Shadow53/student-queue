/**
 * Created by michael on 2/3/16.
 */
var socket = io();
$(document).ready(function(){
    var pwObj = $("#pwInput");
    $("#btnLogin").on("click", function(e){
        var pw = pwObj.val();
        socket.emit('login', pw)
    });

    socket.on('loginAuth', function(contents){
        $("#main").html(contents);
    });
});