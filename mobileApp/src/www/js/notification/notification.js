/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/31/13, at 7:34 PM.
 */

var notification = (function () {

    function vibrate(miliseconds) {
        navigator.notification.vibrate(miliseconds);
    }

    function alert(message, title, buttonName) {
        navigator.notification.alert(message, title, buttonName);
    }

    function beep(times) {
        navigator.notification.beep(times);
    }

    return {
        vibrate: vibrate,
        popUp: alert,
        beep: beep
    };

}());
