"use strict";
function isBathroom(){
  return $("input[name='isBathroom'][value='true']").is(":checked");
}

$(document).ready(function(){

  $("input[name='isBathroom'][value='false']").attr("checked", "checked");

  $("input[name='isBathroom']").click(function(){
    var problemInput = $("#problemText");
    if (isBathroom()){
      problemInput.prop("disabled", "disabled");
    }
    else {
      problemInput.removeAttr("disabled");
    }
  });

  var socket = io();
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

          if (isBathroom()){
            socket.emit('bathroomRequest', {name: studentName, id: studentId, time:
                Date.now()});
            alert("Bathroom request sent");
          }
          else {
            socket.emit('studentRequest', { name: studentName, id: studentId,
              problem: problemText });
            alert("Request sent");
          }
          $("input[type='text']").val("");
          $("input[name='isBathroom'][value='false']").attr("checked", "checked");
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