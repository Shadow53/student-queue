/**
 * Created by michael on 2/3/16.
 */
var pathArr = document.location.pathname.split("/");
var index = pathArr.indexOf("admin", pathArr.length - 3);
if (index === -1 ){
    throw new Error("Die: Cannot parse the path.");
}

var room = pathArr[index - 1];
socket = io("/" + room.toLowerCase());

$(document).ready(function(){

    $("#changePass").on("click", function(){
        changePassword();
    });

    $("input[type=password]").on("keypress", function(e){
        if (e.keyCode === 13){
            changePassword();
        }
    });

    socket.on("changePassResult", function(msg){
        $("#main").text(msg);
    });
});

function changePassword(){
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
}