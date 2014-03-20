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
 * Created on 19/03/14, at 23:28.
 */
var modules = modules || {};

/**
 * Module to work with promotions. Each promotion has attributes: id, descripcion, clinicas, rangoEtario, cantidadSemanas, activa, fechaInicio.
 *
 * Promotions are taken from Google Drive's spreadsheets.
 */
modules.promotion = (function () {

    var getStartDate = function (startDateString) {
        return new Date(Date.parse(startDateString.split('/').reverse().join('/')));
    };

    var getEndDate = function (promotion) {
        var date = getStartDate(promotion.fechaInicio);
        date.setDate(date.getDate() + promotion.cantidadSemanas * 7);

        return date;
    };

    var getEndDateString = function (promotion) {
        var endDate = getEndDate(promotion);

        return endDate.getDate() + '/' + (endDate.getMonth() + 1);
    };

    var isVisible = function (promotion) {
        return new Date() <= getEndDate(promotion);
    };

    return {
        calculateEndDate: getEndDateString,
        isVisible: isVisible
    };
}());