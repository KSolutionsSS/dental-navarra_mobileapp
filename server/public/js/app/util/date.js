/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 1/12/14, at 9:15 PM.
 */
var app = app || {};
app.util = app.util || {};

app.util.date = (function () {

    function getYears(number) {
        var age = Date.now() - new Date(number.substring(4, 8), number.substring(2, 4), number.substring(0, 2), 0, 0, 0);
        return Math.floor(age / 31557600000);
        // The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 Which is the length of a year,
        // the length of a year is 365 days and 6 hours which is 0.25 day.
    }

    return {
        getYears: getYears
    };
}());