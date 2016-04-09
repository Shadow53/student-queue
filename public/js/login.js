/**
 * Created by michael on 3/20/16.
 */
function login(socket){

    function submitLogin(e){
        var pw = $("#pwInput").val();
        socket.emit('login', pw);
        e.preventDefault();
    }

    var loginDefer = $.Deferred();

    var container = $("<div></div>", {
        id: "login"
    }).html('<form name="loginDiv">' +
        '<label>Please enter the teacher password: <input type="password" name="pw" id="pwInput"></label>' +
        //'<button type="button" class="button" id="btnLogin">Authenticate</button>' +
        '<span id="loginStatus"></span>' +
        '</form>');

    var overlay = $("<div id='overlay'></div>");

    $("body").append(container, overlay);

    var loginModal = $(container).dialog({
        buttons: [{
            text: "Login",
            icons: {
                primary: "ui-icon-close"
            },
            click: submitLogin
        }],
        closeOnEscape: false,
        modal: true,
        title: "Authorization Required"
    });

    $("#pwInput").on("keypress", function(e){
        if (e.keyCode === 13) submitLogin(e);
    });

    socket.on('loginAuth', function(success){
        if (success){
            $("#overlay").hide();
            $(loginModal).dialog("close");
            loginDefer.resolve();
        }
        else {
            $("#loginStatus").text("Failed to login.");
            loginDefer.reject();
        }
    });

    $(loginModal).dialog("open");
    $("#pwInput").focus();

    return loginDefer.promise();
}