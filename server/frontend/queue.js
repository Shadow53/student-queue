var socket = io();
socket.on('addToQueue', function(student){
  $('#queue').append($('<div />').text(student));
});

$("#test").click(function(){
        socket.emit('addtoQueue', "Adding student to queue");
        return false;
      });
