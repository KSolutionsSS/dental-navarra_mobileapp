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

var app = app || {};
app.views = app.views || {};

app.views.login = (function () {

    var $view = $('#loginView');

    var bindLoginFormEvents = function () {
        $view.find('form').submit(function (event) {
            event.preventDefault();

            $('.alert').fadeOut();

            modules.patient.login($('#email').val(), $('#password').val(), function (response) {
                var handleSuccessfulLogin = function (patientFromServer) {
                    console.log('User ' + patientFromServer.email + ' successfully logged');
                    console.log('User information: ' + patientFromServer._id + ', office: ' + patientFromServer.office);

                    patient = {
                        _id: patientFromServer._id,
                        email: patientFromServer.email,
                        office: patientFromServer.office
                    };
                    localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
                    app.displayNextView('#homeView');
                };

                switch (response.statusCode) {
                    case 200:
                        handleSuccessfulLogin(response.patient);
                        break;
                    case 404:
                        $('#alert-username').fadeIn();
                        break;
                    case 401:
                        $('#alert-password').fadeIn();
                }
            }, function (jqXHR) {
                console.log('No se pudo realizar la petición de login: ' + jqXHR.status);
                $('#alert-generic').fadeIn();
            });
        });
    };

    return {
        init: bindLoginFormEvents
    };
}());