/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 06/02/14, at 17:34.
 */

var rememberNotification = {};

rememberNotification.render = function (message, endDate) {
    var $view = $('#rememberNotificationView');
    $view.find('p').html(message);

    var callLink = $view.find('a');
    callLink.attr('href', callLink.attr('href') + patient.office.phoneNumber);
};