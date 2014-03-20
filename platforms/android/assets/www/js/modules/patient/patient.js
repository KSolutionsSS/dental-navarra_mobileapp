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

    var AGES = Object.freeze({
                                 CHILD: {
                                     id: 'niños',
                                     maximumAge: 15
                                 },
                                 TEEN: {
                                     id: 'adolescentes',
                                     maximumAge: 25
                                 },
                                 ADULT: {
                                     id: 'adultos',
                                     maximumAge: 64
                                 },
                                 RETIRED: {
                                     id: 'jubilados'
                                 }
                             });

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

        //  TODO : Refactor :  Change this to PUT HTTP method (browser is caching the request, or it's rejected by the server (I don't know)
        $.ajax({
                   type: "POST",
                   url: SERVER_URL + 'patients/' + patient._id + '/changePassword',
                   data: patient
               }).done(onSuccess).fail(onError);
    };

    var isOfficeIn = function (patient, offices) {
        return offices.some(function (eachOffice) {
            return patient.office.city.toLowerCase() === eachOffice.toLowerCase();
        });
    };

    var isAgeAllowed = function (patient, promotion) {
        //  TODO : Functionality : Finish isAgeAllowed functionality to filter promotions based on patient's age.
        return true;
    };

    var getPersonalizedPromotions = function (patient, promotions) {
        return promotions.filter(function (eachPromotion) {
            var show = false;

            if (eachPromotion.activa === 'si') {
                show = isOfficeIn(patient, eachPromotion.clinicas.split(','));

                if (show) {
                    show = modules.promotion.isVisible(eachPromotion);

                    if (show) {
                        show = isAgeAllowed(patient, eachPromotion);
                    }
                }
            }

            return show;
        });
    };

    return {
        login: login,
        changePassword: changePassword,
        getPersonalizedPromotions: getPersonalizedPromotions
    };

}());
