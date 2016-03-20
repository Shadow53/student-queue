/**
 * Created by michael on 2/3/16.
 */
var socket;
$(document).ready(function(){

    var pathArr = document.location.pathname.split("/");
    var index = pathArr.indexOf("teacher", pathArr.length - 3);
    if (index === -1 ){
        throw new Error("Die: Cannot parse the path.");
    }

    var room = pathArr[index - 1];
    socket = io("/" + room.toLowerCase());

    var loginModal = $("#login").dialog({
        buttons: [{
            text: "Login",
            icons: {
                primary: "ui-icon-close"
            }
        }],
        closeOnEscape: false,
        modal: true,
        title: "Authorization Required"
    });

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

    socket.on('loginAuth', function(success){
        if (success){
            $("#overlay").hide();
            $(loginModal).dialog("close");
        }
        else {
            $("#loginStatus").text("Failed to login.");
        }
    });

    $(loginModal).dialog("open");
    $("#pwInput").focus();
});

function login(){
    var pw = $("#pwInput").val();
    socket.emit('login', pw);
}