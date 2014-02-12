/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 06/02/14, at 17:34.
 */

var app = app || {};
app.views = app.views || {};

app.views.rememberNotification = (function () {
    var $view = $('#rememberNotificationView');

    return {
        render: function (message, meetingDate) {
            console.log('Rendering view with message: ' + message + ', meetingDate: ' + meetingDate);
            $view.find('#rememberDetail').html(message);
            $view.find('.badge').html(meetingDate.substring(0, meetingDate.lastIndexOf('/')));

            if (patient) {
                if (patient.office) {
                    var callLink = $view.find('a');
                    callLink.attr('href', callLink.attr('href') + patient.office.phoneNumber);
                } else {
                    console.log('There is no office information in the patient object, hiding button...');
                    $view.find('div.row:nth-child(2)').hide();
                }
            }
        }
    };
}());