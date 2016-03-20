"use strict";
function isBathroom(){
  return $("input[name='isBathroom'][value='true']").is(":checked");
}

$(document).ready(function(){
  var pathArr = document.location.pathname.split("/");
  var room = pathArr[pathArr.indexOf("student", pathArr.length - 3) - 1];
  var socket = io("/" + room.toLowerCase());

  $("#submitHelpRequest").click(function(e){
    var sName = $("#studentName");
    var studentName = sName.val();
    var sId = $("#studentId");
    var studentId = sId.val();
    var problemText = $("#problemText").val();

    if (isNaN(Number(studentId)) || studentId.length === 0){
      alert("Your student ID doesn't look like it's a number.");
      sId.focus();
    }
    else {
      if (studentId.length > 6 || studentId.length < 6){
        alert("Your student ID should be six digits long.");
        sId.focus();
      }
      else {
        if (studentName.length > 3){

          socket.emit('studentRequest', { name: studentName, id: studentId,
            problem: problemText });
          alert("Request sent");

          $("input[type='text']").val("");
          $("textarea").val("");
        }
        else {
          alert("Your name seems too short.");
          sName.focus();
        }
      }
    }
  });

  $(window).on('beforeunload', function(){
    socket.close();
  });
});