var socket = io();
socket.on('addToQueue', function(student){
  $('#queue').append($('<div class="queue-item">').text(student));
});
