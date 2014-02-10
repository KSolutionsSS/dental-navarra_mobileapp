var app = app || {};
app.views = app.views || {};

app.views.login = (function () {

    var bindLoginFormEvents = function () {
        $('form').submit(function (event) {
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
        init: function () {
            /**
             * Check for logged user...
             */
            (function () {
                //  TODO : Delete this line or context.
//                patient = {"_id": "52f5036af687300200acd105", "email": "barrios.nahuel@gmail.com", "office": "tafalla"};
//                localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));


                patient = JSON.parse(localStorage.getItem(PATIENT_KEY));
                if (patient) {
                    console.log('User already logged, skipping login view');
                    app.displayNextView('#homeView');
                } else {
                    console.log('User not logged, waiting user to login');
                }

                bindLoginFormEvents();
            }());
        }
    };
}());