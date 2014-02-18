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

    /**
     * @param patient Must contains attributes: _id, email, currentPassword, newPassword
     */
    var changePassword = function (patient, onSuccess, onError) {
        console.log('Trying to change user password for user: ' + patient.email);

        console.log('current: ' + patient.currentPassword);
        console.log('new:' + patient.newPassword);

        delete patient.email;

        $.ajax({
                   type: "PUT",
                   url: SERVER_URL + 'patients/' + patient._id + '/changePassword',
                   data: patient
               }).done(onSuccess).fail(onError);
    };

    return {
        login: login,
        changePassword: changePassword
    };

}());
