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
 * Created on 12/02/14, at 13:24.
 */
var app = app || {};
app.views = app.views || {};

app.views.changePassword = (function () {

    var $view = $('#changePasswordView');

    var hideResultMessages = function () {
        $view.find('.alert').hide();
    };

    var bindEvents = function () {
        var getClassNameToRemove = function ($element, includePreffix, exclude) {
            var toReturn = '';
            var classes = $element.attr('class').split(' ');

            var stringRegExp = '(' + includePreffix + ')';
            if (exclude) {
                stringRegExp = '(?!' + exclude + ')' + stringRegExp;
            }

            var regExp = new RegExp(stringRegExp);
            for (var index = 0; index < classes.length; index++) {
                if (regExp.test(classes[index])) {
                    toReturn += classes[index] + ' ';
                    //  TODO : Functionality : Check this, I'm using only one result!
                }
            }

            return toReturn;
        };

        var clearFocusState = function ($element) {
            var $div = $element.parent();

            $div.removeClass(getClassNameToRemove($div, 'has-', 'has-feedback'));

            var $span = $div.find('span');
            $span.removeClass(getClassNameToRemove($span, 'glyphicon-[a-z][A-Z]*'));
        };

        var validateInput = function ($element, validator) {
            var $div = $element.parent();

            var isValid = validator($element.val());
            if (isValid) {
                $div.addClass('has-success');
                $div.find('span').addClass('glyphicon-ok');
            } else {
                $div.addClass('has-error');
                $div.find('span').addClass('glyphicon-remove');
            }

            return isValid;
        };

        var $currentPassword = $view.find('#currentPassword');
        var $newPassword1 = $view.find('#newPassword1');
        var $newPassword2 = $view.find('#newPassword2');

//        $currentPassword.focusout(function () {
//            clearFocusState($currentPassword);
//            validateInput($currentPassword, function (value) {
//                console.log('Validating current password against input value: ' + value);
//                //  TODO : Functionality : Validate current password
//                return true;
//            });
//        });

        $newPassword1.focusout(function () {
            clearFocusState($newPassword1);

            if ($newPassword1.val() === '') {
                clearFocusState($newPassword2);
                $newPassword2.attr('disabled', 'disabled');
            } else if (validateInput($newPassword1, function (value) {
                return value !== '';
            })) {
                $newPassword2.removeAttr('disabled');
            }
        });

        $newPassword2.focusout(function () {
            clearFocusState($newPassword2);
            validateInput($newPassword2, function (value) {
                console.log('Validating that two new password matches...');
                return value === $('#newPassword1').val();
            });
        });

        $view.find('form').submit(function (event) {
            event.preventDefault();
            hideResultMessages();

            var onSuccess = function (data) {
                console.log('onSuccess()');
                console.log('data vale: ' + JSON.stringify(data));
                if (data.statusCode) {
                    if (data.statusCode === 401) {
                        console.log('Showing warning message');
                        $view.find('.alert-warning').show();
                    } else {
                        console.log('Showing error message');
                        onError(data);
                    }
                } else {
                    console.log('Password successfully updated');
                    $view.find('.alert-success').show();
                }
            };
            var onError = function (jqXHR) {
                console.log('Can\'t update user password:' + jqXHR.statusCode);
                $view.find('.alert-danger').show();
            };


            console.log('salgo con current: ' + $currentPassword.val() + ', nueva: ' + $newPassword1.val());
            modules.patient.changePassword({
                                               _id: patient._id,
                                               email: patient.email,
                                               currentPassword: $currentPassword.val(),
                                               newPassword: $newPassword1.val()
                                           }, onSuccess, onError);

            console.log('Submit change!!');
        });

        console.log('Change password form events set.');
    };

    var init = function () {
        hideResultMessages();
        bindEvents();
    };

    return {
        init: init
    };
}());