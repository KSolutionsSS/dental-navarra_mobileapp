/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 1/24/14, at 7:14 PM.
 */
var app = app || {};
app.util = app.util || {};

app.util.array = (function () {

    function getId(array, criteria) {
        return array.filter(criteria)[0]._id;
    }

    function getObject(array, criteria) {
        return array.filter(criteria)[0];
    }

    return {
        getObject: getObject,
        getId: getId
    };
}());