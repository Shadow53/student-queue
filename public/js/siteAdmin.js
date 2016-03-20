/**
 * Created by michael on 3/19/16.
 */
var socket = io("/admin");
socket.on("giveAllQueues", function(err, queues){
    if (err){
        console.error(err);
    }
    else {
        var accordion = $("#existingQueues");
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
                    click: function(e){
                        socket.emit("deleteQueue", queue.name);
                    }
                }
            }).appendTo(content);

            accordion.append(title, content);
        });

        $(accordion).accordion({
            collapsible: true,
            active: false,
            heightStyle: "content",
            header: "h3"
        });

        $("#queueAdmin").tabs({
            active: 1,
            heightStyle: "content"
        });

        $("#makeNewQueue").on("click", function(e){
            var name = $("#newName").val();
            var pass1 = $("#pass1").val();
            var pass2 = $("#pass2").val();
            var desc = $("#desc").val();

            var nameRegExp = /(^\w)\w+/;
            if (!nameRegExp.test(name)){
                alert("There is something wrong with the name you inputted. Try again.");
            }
            else if (pass1.length < 8){
                alert("Your password is too short.");
            }
            else if (pass1 !== pass2){
                alert("Passwords do not match.");
            }
            else {
                var queue = {name: name, password: pass1};
                if (desc !== "") queue.description = desc;
                socket.emit("addNewQueue", queue);
            }
        });

        socket.on("addedNewQueue", function(err){
            if (err){
                console.error(err);
                alert(err.toString());
            }
            else {
                // Something better than refresh?
                location.reload();
            }
        });

        socket.on("deletedQueue", function(err){
           if (err){
               console.error(err);
               alert(err.toString());
           }
           else {
               location.reload();
           }
        });
    }
});
socket.emit("getAllQueues");