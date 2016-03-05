/**
 * Created by michael on 2/3/16.
 */
var socket = io();
$(document).ready(function(){

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