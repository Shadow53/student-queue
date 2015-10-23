var socket = io();
socket.on('addToQueue', function(student){
  console.log("Received request to add to queue");
  $('#queue').append($('<div />').text(student));
});

$("#test").click(function(){
  console.log("Adding student to queue");
  socket.emit('addtoQueue', "Added student to queue");
  return false;
});
