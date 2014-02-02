/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

var mailSender = require('../service/mailSender');

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
                {message: 'Tienes que hacerte un control radiográfico dentro de 1 mes.', endDate: '01/03/2014'}
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

    exports.save = function (req, res) {
        var user = req.body;
        console.log('Adding patient: ' + JSON.stringify(user));
        db.collection(collectionName, {strict: true}, function (err, collection) {
            collection.insert(user, {safe: true}, function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred trying to save a patient'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));

                    var mailOptions = {
                        to: user.email,
                        subject: '¡Bienvenido a Dental Navarra! ✔',
                        html: '<h3>¡Bienvenido a Dental Navarra!</h3>\n<p>¡Gracias por atenderte en los consultorios de Dental Navarra!</p>\n<p>Con tu direcci&oacute;n de correo electr&oacute;nico y la contraseña que te indicamos a continuaci&oacute;n podr&aacute;s iniciar sesi&oacute;n en la aplicaci&oacute;n m&oacute;vil de Dental Navarra.</p>\n<blockquote>Contraseña: <b><i>112233</i></b></blockquote>\n<p>¿Todav&iacute;a no tienes la aplicaci&oacute;n? Puedes descargarla desde el Play Store de tu Android ingresando a <a href="https://play.google.com/store/apps/details?id=com.nbempire.android.magicannotator">este link</a>.</p>\n<p>¡Que disfrutes la aplicaci&oacute;n!</p>\n<p>Atentamente, el equipo de Dental Navarra.</p>' // html body
                    };

                    //  TODO : Functionality : Put this sender dynamic.
                    mailSender.send('tafalla', mailOptions, function (error, response) {
                        if (error) {
                            //  TODO : Functionality : Resend the email!!
                            console.log('The welcome message email could not be sent: ' + error);
                        } else {
                            console.log('Welcome message email sent to: ' + user.email);
                        }

                        res.send(result[0]);
                    });
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
                    console.log('' + result + ' document(s) updated');
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

}());

