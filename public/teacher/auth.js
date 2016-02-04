/**
 * Created by michael on 2/3/16.
 */
var socket = io();
$(document).ready(function(){
    $("#btnLogin").on("click", function(e){
        login();
    });

    $("#pwInput").on("keypress", function(e){
        if (e.keyCode === 13){
            login();
            e.preventDefault();
            //return false;
        }
    });

    socket.on('loginAuth', function(contents){
        $("#main").html(contents);
    });
});

function login(){
    var pw = $("#pwInput").val();
    socket.emit('login', pw)
}