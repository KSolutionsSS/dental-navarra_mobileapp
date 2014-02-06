/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 2/2/14, at 3:58 PM.
 */
var nodemailer = require("nodemailer");

var getCorrespondingAccount = function (id) {
    var configuredAccounts = {
        tafalla: {
            name: 'Clínica Odontológica Tafalla',
            user: 'tafalla@dentalnavarra.com',
            pass: 'This is not the password LOL'
        },
        alsasua: {
            name: 'Clínica Dental Alsasua',
            user: 'alsasua@dentalnavarra.com',
            pass: 'This is not the password LOL'
        },
        milagro: {
            name: 'Clínica Dental Milagro',
            user: 'milagro@dentalnavarra.com',
            pass: 'This is not the password LOL'
        },
        test: {
            name: 'Nahuel Barrios',
            user: 'barrios.nahuel@gmail.com',
            pass: 'This is not the password LOL'
        }
    };

    var officeName;
    var eachAttribute;
    for (eachAttribute in configuredAccounts) {
        if (configuredAccounts.hasOwnProperty(eachAttribute)) {
            if (id === eachAttribute) {
                officeName = eachAttribute;
                break;
            }
        }
    }

    return configuredAccounts[officeName];
};

var sendMail = function (sender, options, callback) {
//    var senderAccount = getCorrespondingAccount(sender);
    // TODO : Unhard-code this.
    var senderAccount = getCorrespondingAccount('test');

    if (senderAccount) {
        options.from = senderAccount.name + ' ✔ <' + senderAccount.user + '>';//Sender address
        console.log('Sending email from account: ' + options.from);

        //  Create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: senderAccount
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
    } else {
        console.log('IMPORTANT: Someone is hacking the site. He tried to send an email from sender: "' + sender + '".');
        //  TODO : Functionality : Send me an email to check site's security.
    }
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
        from: "Nahuel Barrios ✔ <barrios.nahuel@gmail.com>",
        to: "barrios.nahuel@gmail.com",
        subject: "hola ✔",
        html: "<p>Hola <b>Nahuel ✔</b>!<br>Este es un email de prueba.</p>"// HTML body.
    };

    sendMail(mailOptions, function (error, response) {
        console.log('Ya mande el mail de test a: ' + mailOptions.to);
    });
};