/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 2/2/14, at 3:58 PM.
 */
var nodemailer = require("nodemailer");

var accounts = {
    tafalla: {
        user: 'tafalla@dentalnavarra.com',
        pass: '112233'
    },
    alsasua: {
        user: 'alsasua@dentalnavarra.com',
        pass: '112233'
    },
    milagro: {
        user: 'milagro@dentalnavarra.com',
        pass: '112233'
    },
    test: {
        user: 'barrios.nahuel@gmail.com',
        pass: 'this is not my password LOL'
    }
};

var sendMail = function (sender, options, callback) {
    //  TODO : Functionality : Check which of the configured senders must use.

    options.from = 'Nahuel Barrios ✔ <barrios.nahuel@gmail.com>';// sender address

    //  Create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: accounts.test
    });

    smtpTransport.sendMail(options, function (error, response) {
        if (error) {
            console.log('There was an error sending mail to: ' + options.to);
            console.log(error);
        } else {
            console.log("Welcome message sent: " + response.message);
        }

        callback(error, response);

        //If you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
};


//=============================================================================
//                          Exported methods
//=============================================================================
/**
 *
 * @param sender One of the configured email addresses.
 * @param options Must contain the following attributes: from, to (email addresses comma separated list), subject and html. Require unicode symbols.
 * @param callback Just a callback which will receive parameters error, and response.
 */
exports.send = function (sender, options, callback) {
    sendMail(sender, options, callback);
};

//=============================================================================
//                          Test module
//=============================================================================
var testMailSender = function () {
    //  Setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Nahuel Barrios ✔ <barrios.nahuel@gmail.com>", // sender address
        to: "barrios.nahuel@gmail.com", // list of receivers
        subject: "hola ✔", // Subject line
        html: "<b>Toma wacheen ✔ mira, hasta te puse ese tilde y todo jaja... <br>Ahí esta andando, había puesto mal mi propia contraseña jaja, soy un gil xD</b>" // html body
    };

    sendMail(mailOptions, function (error, response) {
        console.log('Ya mande el mail de test a: ' + mailOptions.to);
    });
};