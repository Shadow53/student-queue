/**
 * Created by michael on 3/1/16.
 */

function aboutToAskToNotify(reason){
    alert("Your browser is about to ask you if you want to allow notifications. This is so that we can " + reason);
}

function askToNotify(){
    var canNotify = false;
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            canNotify = true;
        }
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    canNotify = true;
                }
            });
        }
    }
    return canNotify;
}