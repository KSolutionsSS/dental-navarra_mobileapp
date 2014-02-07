/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 06/02/14, at 17:34.
 */

$(document).ready(function () {
    var getURLParameter = function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    var $view = $('#rememberNotificationView');
    $view.find('p').html(decodeURIComponent(getURLParameter('message')));
    $view.find('span.badge').html(getURLParameter('endDate'));

    var patient = JSON.parse(localStorage.getItem('patient'));
    var callLink = $view.find('a');
    callLink.attr('href', callLink.attr('href') + patient.office.phoneNumber);
});