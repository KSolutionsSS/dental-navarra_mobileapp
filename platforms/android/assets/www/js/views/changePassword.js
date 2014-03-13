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

    var isInitialised;
    var $view = $('#changePasswordView');
    var $button = $view.find('button');

    var $currentPassword = $view.find('#currentPassword');
    var $newPassword1 = $view.find('#newPassword1');
    var $newPassword2 = $view.find('#newPassword2');

    var hideResultMessages = function () {
        $view.find('.alert').hide();
    };

    var bindEvents = function () {
        /**
         * @param validator function that returns true/false
         * @returns true/false if the value is valid or not
         */
        var validateInput = function ($element, validator) {
            clearState($element);

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

        /**
         * Events for newPassword1 input element
         */
        (function () {
            var isValidInput = function (value) {
                return value !== '' && value.length > 5;
            };

            $newPassword1.keyup(function (event) {
                var value = $newPassword1.val();

                if (validateInput($newPassword1, isValidInput)) {
                    $newPassword2.removeAttr('disabled');
                } else {
                    $newPassword2.attr('disabled', 'disabled');
                    $newPassword2.val('');
                    clearState($newPassword2);
                }
            });
        }());


        /**
         * Events for newPassword2 input element
         */
        (function () {
            var validateNewPasswords = function (value) {
                console.log('Validating that two new password matches...');
                return value === $('#newPassword1').val();
            };

            $newPassword2.keyup(function (event) {
                if (validateInput($newPassword2, validateNewPasswords)) {
                    $button.removeAttr('disabled');
                } else {
                    $button.attr('disabled', 'disabled');
                }
            });
        }());

        $view.find('form').submit(function (event) {
            event.preventDefault();
            hideResultMessages();

            var onSuccess = function () {
                console.log('Password successfully updated');
                $view.find('.alert-success').fadeIn();
                resetFields();
            };
            var onError = function (jqXHR) {
                console.log('Can\'t update user password:' + jqXHR.status);
                if (jqXHR.status === 401) {
                    console.log('Showing warning message');
                    $view.find('.alert-warning').show();
                } else {
                    console.log('Showing error message');
                    $view.find('.alert-danger').show();
                }
            };

            modules.patient.changePassword({
                                               _id: patient._id,
                                               email: patient.email,
                                               currentPassword: $currentPassword.val(),
                                               newPassword: $newPassword1.val()
                                           }, onSuccess, onError);
        });

        console.log('Change password form events set.');
    };

    var init = function () {
        $button.attr('disabled', 'disabled');
        hideResultMessages();
        bindEvents();
        isInitialised = true;
    };


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

    var clearState = function ($element) {
        var $div = $element.parent();

        $div.removeClass(getClassNameToRemove($div, 'has-', 'has-feedback'));

        var $span = $div.find('span');
        $span.removeClass(getClassNameToRemove($span, 'glyphicon-[a-z][A-Z]*'));
    };

    var resetFields = function () {
        var resetField = function ($element) {
            $element.val('');
            clearState($element);
        };

        resetField($currentPassword);
        resetField($newPassword1);
        resetField($newPassword2);
    };

    return {
        init: init,
        isInitialised: function () {
            return isInitialised;
        },
        reset: function () {
            hideResultMessages();
            resetFields();
        }
    };
}());