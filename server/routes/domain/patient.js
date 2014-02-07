/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

var mailSender = require('../service/mailSender');
var passwordHash = require('password-hash');
var generatePassword = require('password-generator');

(function () {
    var collectionName = 'patients';

    var methods = {
        findById: function (id, callback) {
            console.log('Retrieving patient: ' + id);
            db.collection(collectionName, function (err, collection) {
                collection.findOne({'_id': new BSON.ObjectID(id)}, callback);
            });
        },
        getNotifications: function (patient) {
            console.log('Checking notifications for patient: ' + patient._id);
            //  TODO : Functionality : Calculate this.
            return [
                {message: 'Te hiciste un tratamiento de limpieza hace 5 meses, tendrías que hacerte otro dentro de 1 mes.', endDate: '01/03/2014'},
                {message: 'Tienes que hacerte un control radiográfico dentro de 1 mes.', endDate: '01/03/2014'},
                {message: 'Tienes que hacerte el segundo implante.', endDate: '01/03/2014'},
                {message: 'Deberías concurrir para un control general.', endDate: '01/03/2014'}
            ];
        }
    };

    exports.findAll = function (req, res) {
        console.log('Finding all patients');
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    exports.findById = function (req, res) {
        methods.findById(req.params.id, function (err, item) {
            res.send(item);
        });
    };

    /**
     * @param req In its body attribute must contain an object with: name, lastName, secondLastName, email, birthday, office.
     * @param res A response object.
     */
    exports.save = function (req, res) {
        var user = req.body;
        console.log('Adding patient: ' + JSON.stringify(user));

        //  TODO : Unhard-code this.
//        var generated = generatePassword();
        var generated = 'test';
        user.password = passwordHash.generate(generated);

        db.collection(collectionName, {strict: true}, function (err, collection) {
            collection.insert(user, {safe: true}, function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred trying to save a patient'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));

                    var mailOptions = {
                        to: user.email,
                        subject: '¡Bienvenido a Dental Navarra! ✔',
                        html: '<h3>¡Bienvenido a Dental Navarra!</h3>\n<p>¡Gracias por atenderse en los consultorios de Dental Navarra!</p>\n\n<p>A continuaci&oacute;n le indicamos los datos para iniciar sesi&oacute;n en la aplicaci&oacute;n m&oacute;vil de Dental Navarra.</p>\n\n<ul>\n    <li>Usuario: <b><i>'
                                  + user.email + '</i></b></li>\n    <li>Contraseña: <b><i>' + generated
                            + '</i></b></li>\n</ul>\n\n<p>¿Todav&iacute;a no tienes la aplicaci&oacute;n? Puedes descargarla desde el Play Store de tu Android ingresando a <a\n        href="https://play.google.com/store/apps/details?id=com.nbempire.android.magicannotator">este link</a>.</p>\n<p>¡Que disfrutes la aplicaci&oacute;n!</p>\n<p>Atentamente, el equipo de Dental Navarra.</p>\n<p>No olvides visitar nuestra web <a href="http://www.dentalnavarra.com">DentalNavarra.com</a>.</p>'
                    };

                    //  TODO : Unhard-code this.
//                    mailSender.send(user.office, mailOptions, function (error, response) {
//                        if (error) {
//                            //  TODO : Functionality : Resend the email!!
//                            console.log('The welcome message email could not be sent: ' + error);
//                        } else {
//                            console.log('Welcome message email sent to: ' + user.email);
//                        }
//
//                        res.send(result[0]);
//                    });
                }
            });
        });
    };

    exports.update = function (req, res) {
        var id = req.params.id;
        var patient = req.body;

        console.log('Updating patient: ' + id);
        console.log(JSON.stringify(patient));

        patient._id = new BSON.ObjectID(id);

        db.collection(collectionName, function (err, collection) {
            collection.update({'_id': patient._id}, patient, {safe: true}, function (err, result) {
                if (err) {
                    console.log('Error updating patient: ' + err);
                    //  TODO : verify error code when error!!
                    res.send({'error': 'An error has occurred'});
                } else {
                    console.log('...' + result + ' document(s) updated');
                    res.send(patient);
                }
            });
        });
    };

    exports.findNotificationsById = function (req, res) {
        var id = req.params.id;
        console.log('Retrieving notifications for patient: ' + id);
        methods.findById(id, function (err, item) {
            res.send(methods.getNotifications(item));
        });
    };

    /**
     * @param req
     * @param res Will return an object with: _id, statusCode. _id is the patient _id and statusCode is the HTTP statusCode for the operation.
     * 200: Successful login; 401: Wrong pasword; 404: There's not any patient with the specified username.
     */
    exports.login = function (req, res) {
        db.collection(collectionName, function (err, collection) {
            var email = req.params.username;

            collection.findOne({'email': email}, function (err, item) {
                var result = {};

                if (item) {
                    console.log('User found: ' + email + ', id: ' + item._id);

                    if (passwordHash.verify(req.body.password, item.password)) {
                        result.statusCode = 200;
                        result.patient = item;
                    } else {
                        result.statusCode = 401;
                        console.log('Wrong password for username: ' + email);
                    }
                } else {
                    console.log('User NOT found: ' + email);
                    result.statusCode = 404;
                }

                res.send(result);
            });
        });
    };

}());

