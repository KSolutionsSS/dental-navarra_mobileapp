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
 * Created on 12/04/14, at 17:01.
 */
var app = app || {};
app.views = app.views || {};

app.views.publicHome = (function () {

    var $view = $('#publicHomeView');

    var render = function () {
        $view.find('.myContent').html($.render.carousel({carouselId: 'publicHomeCarousel'}));

        var templateParameters = {};
        templateParameters.offices = [];

        for (var eachOffice in offices) {
            if (offices.hasOwnProperty(eachOffice)) {
                templateParameters.offices.push(offices[eachOffice]);
            }
        }

        $view.find('#officesPanelGroup').html($.render.offices(templateParameters));
    };

    var bindEvents = function () {
        console.log('Initialising public home...');
        $view.find('#goToLogin').click(function () {
            app.displayNextView('#loginView');
        });
    };

    return  {
        init: function () {
            render();
            bindEvents();
        }
    };
}());