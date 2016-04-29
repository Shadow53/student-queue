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
                        content.html("<p>" + (queue.description === null ? "<em>This queue has no description.</em>" : queue.description) + "</p>");
                        // TODO: Add ability to change password from here w/out verifying old?
                        var delbtn = $("<button></button>", {
                            id: name + "DeleteBtn",
                            text: "Delete",
                            'class': "button",
                            on: {
                              click: function(e) {
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
                            },
                            type: "submit"
                        }).appendTo($("<form></form>"), {
                            name: name + "EditForm",
                            method: "PUT",
                            action: "/admin/queues"
                        }).appendTo(content);

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