/*
 * Dental Navarra mobile app - Mobile app that patients of Dental Navarra will use to get notifications about their treatments, as well as promotions.
 *     Copyright (C) 2014  Nahuel Barrios
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 06/02/14, at 17:34.
 */

var app = app || {};
app.views = app.views || {};

app.views.rememberNotification = (function () {
    var $view = $('#rememberNotificationView');

    return {
        render: function (remember, startingFromNotification) {
            console.log('Rendering view with message: ' + remember.message + ', meetingDate: ' + remember.meetingDate);

            remember.startingFromNotification = startingFromNotification;
            $('#rememberContainer').html($.render.rememberView(remember));

            if (patient) {
                if (patient.office) {
                    var callLink = $view.find('a');
                    callLink.attr('href', callLink.attr('href') + patient.office.phoneNumber);

                    if (!properties.mock.device) {
                        var onClick = analytics.execute.sendEvent.bind(undefined, analytics.keys.CATEGORY_ACTIONS, analytics.keys.ACTION_CALL_OFFICE,
                                                                       patient.office.city);
                        callLink.click(onClick);
                    }
                } else {
                    console.log('There is no office information in the patient object, hiding button...');
                    $view.find('div.row:nth-child(2)').hide();
                }
            }
        }
    };
}());