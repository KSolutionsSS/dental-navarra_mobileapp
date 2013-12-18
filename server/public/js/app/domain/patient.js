/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 9:29 PM.
 */

var app = app || {};
app.domain = app.domain || {};

app.domain.patient = (function () {

    function generateFullName(patient) {
        return patient.name + ' ' + patient.lastName;
    }

    return {
        generateFullName: generateFullName
    };
}());