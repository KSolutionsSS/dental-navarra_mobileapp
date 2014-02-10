/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 2/6/14, at 12:19 AM.
 */
var modules = modules || {};

modules.patient = (function () {

    var login = function (username, password, onSuccess, onError) {
        console.log('Trying to login user: ' + username);

        $.ajax({
                   type: "POST",
                   url: SERVER_URL + 'patients/' + username + '/login',
                   data: {password: password}
               }).done(onSuccess).fail(onError);
    };

    return {
        login: login
    };

}());
