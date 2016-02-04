/**
 * Created by michael on 2/3/16.
 */
var socket = io();
$(document).ready(function(){

    $("#changePass").on("click", function(){
        var old = $("#old");
        var p1 = $("#pass1");
        var p2 = $("#pass2");

        var oldPass = old.val();
        var pass1 = p1.val();
        var pass2 = p2.val();

        if (pass1 !== pass2){
            $("#error").val("(Passwords did not match)");
            p1.val("");
            p2.val("");
            old.val("");
        }
        else {
            socket.emit("changePass", {old: oldPass, new: pass1});
        }
    });

    socket.on("changePassResult", function(msg){
        $("#main").text(msg);
    });
});