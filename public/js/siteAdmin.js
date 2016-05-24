/**
 * Created by michael on 3/19/16.
 */
$(document).ready(function(){
    //login().done(function(){

        $("#changeAdminPass").on("click", function changePassword(e){
            var old = $("#oldAdmin");
            var p1 = $("#pass1Admin");
            var p2 = $("#pass2Admin");

            if (p1.val() !== p2.val()){
                $("#adminPassChangeError").val("(Passwords did not match)");
                p1.val("");
                p2.val("");
                old.val("");
                return false;
            }
        });

        $("#pass1Admin, #pass2Admin").on("keypress", function(e){
            if (e.keyCode === 13)
                $("#changeAdminPass").click();
        });

        $("#makeNewQueue").on("click", function makeNewQueue(e){
            var p1 = $("#pass1");
            var p2 = $("#pass2");

            if (p1.val() !== p2.val()) {
                $("#newQueueError").val("Passwords did not match");
                p1.val("");
                p2.val("");
                return false
            }
        });$("#logout").click(function(e){
        var href = window.location.href;
        $.post(href + (href.lastIndexOf("/") === href.length-1 ? "" : "/") + "logout");
    })

    var href = window.location.href;
    document.logout.setAttribute("action", href + (href.lastIndexOf("/") === href.length - 1 ? "" : "/") + "logout");

    $.get("/admin/queues")
            .done(function(queues){
                //queues = (queues !== "[]" ? JSON.parse(queues) : []);
                var accordion = $("#existingQueues");
                var startTab = 0;
                if (queues.length > 0){
                    startTab = 1;
                    queues.forEach(function(queue, i, arr){
                        var name = queue.name.toLowerCase();
                        var title = $("<h3></h3>", {
                            id: name + "Title",
                            text: name.charAt(0).toUpperCase() + name.slice(1)
                        });
                        var content = $("<div></div>", {
                            id: name + "Content"
                        });
                        content.html("<p>" + (queue.description === null ?
                                "<em>This queue has no description.</em>" : queue.description) + "</p>");
                        var form = $("<form></form>", {
                            name: name + "EditForm",
                            method: "PUT",
                            action: "/admin/queues"
                        });
                        var delBtn = $("<button></button>", {
                            id: name + "DeleteBtn",
                            text: "Delete",
                            'class': "button",
                            type: "button",
                            on: {
                              click: function deleteButton(e) {
                                  $.ajax({
                                      url: "/admin/queues",
                                      method: "DELETE",
                                      data: {
                                          name: name
                                      }
                                  }).done(function(){ window.location.reload(); })
                                      .fail(function(){alert("An error occurred while deleting queue: " + name)});
                                  return false;
                              }
                            }
                        });
                        var editBtn = $("<button></button>", {
                            id: name + "EditBtn",
                            text: "Modify",
                            'class': "button",
                            type: "button",
                            on: {
                                click: function editButton(e) {
                                    // When I tried this at work, jQuery didn't work
                                    var win = document.createElement("div");
                                    win.setAttribute("id", "queueModifyWindow");
                                    document.body.appendChild(win);
                                    win.innerHTML =
                                        "<form>" +
                                            "<label>" +
                                                "New Password: " +
                                                "<br/><input type='password' name='newPass1' id='queueModifyNewPass1'>" +
                                            "</label>" +
                                            "<br/>" +
                                            "<label>" +
                                                "Verify Password" +
                                                "<br/><input type='password' name='newPass2' id='queueModifyNewPass2'>" +
                                            "</label>" +
                                            "<br/>" +
                                            "<label>" +
                                                "Description:" +
                                                "<br/><textarea name='modifyDescription' id='modifyDescription'>" +
                                                    queue.description +
                                                "</textarea>" +
                                            "</label>" +
                                        "</form>";
                                    var dialog = $(win).dialog({
                                        title: "Modifying " + name.charAt(0).toUpperCase() + name.slice(1),
                                        modal: true,
                                        buttons: [
                                            {
                                                text: "Save",
                                                icons: "ui-icon-document",
                                                click: function modifySubmit(e) {
                                                    var dialog = this;
                                                    var pass1 = document.getElementById("queueModifyNewPass1");
                                                    var pass2 = document.getElementById("queueModifyNewPass2");
                                                    var desc = document.getElementById("modifyDescription");
                                                    // TODO: Change from alerts
                                                    if (pass1.value.length < 8) {
                                                        alert("The password needs to be longer");
                                                        pass1.focus();
                                                    }
                                                    else if (pass1.value !== pass2.value) {
                                                        alert("Passwords do not match");
                                                        pass1.value = "";
                                                        pass2.value = "";
                                                    }
                                                    else {
                                                        var result = $.ajax({
                                                            data: {
                                                                name: queue.name,
                                                                password: pass1.value,
                                                                description: desc.value
                                                            },
                                                            method: "PUT",
                                                            // TODO: Change these to something other than alerts
                                                            statusCode: {
                                                                400: function(){
                                                                    alert("Sorry, something you provided was invalid. Please try again");
                                                                },
                                                                403: function(){
                                                                    alert("You were not authenticated for this update. Please try again later.");
                                                                    window.location.reload(true);
                                                                },
                                                                500: function(){
                                                                    alert("An internal server error occurred. Please try again in a little bit.");
                                                                    $(dialog).dialog("close");
                                                                }
                                                            },
                                                            url: "/admin/queues"
                                                        });

                                                        result.done(function(){
                                                            $(dialog).dialog("close");
                                                            window.location.reload();
                                                        });
                                                    }
                                                }
                                            }
                                        ]
                                    });
                                    // End dialog definition
                                    dialog.dialog("open");
                                }
                            }
                        });

                        delBtn.appendTo(form)
                        editBtn.appendTo(form);
                        form.appendTo(content);

                        accordion.append(title, content);
                    });

                    $(accordion).accordion({
                        collapsible: true,
                        active: false,
                        heightStyle: "content",
                        header: "h3"
                    });
                }

                $("#queueAdmin").tabs({
                    active: startTab,
                    heightStyle: "content"
                });
            });
    //});
});