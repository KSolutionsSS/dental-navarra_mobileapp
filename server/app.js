/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

//  Application properties
var appPort = 8080;
var apiPort = 8081;

var dbName = 'mispacientesdb';
var dbHost = 'localhost';
var dbPort = 27017;

//  Module dependencies
var express = require('express');
var routes = require('./routes');

var admin = require('./routes/domain/admin');
var patient = require('./routes/domain/patient');
var treatment = require('./routes/domain/treatment');
var user = require('./routes/domain/user');
var wine = require('./routes/domain/wine');

var http = require('http');
var path = require('path');

var app = express();
var api = express();

/**
 * Configures the API server. It sets the port and the corresponding headers to allow CORS support.
 */
var configureApiServer = function () {
    api.set('port', process.env.PORT || apiPort);

    api.use(express.logger('dev'));
    api.use(express.bodyParser());

    //  CORS support, taken from: https://github.com/visionmedia/express/blob/master/examples/cors/index.js
    api.all('*', function (req, res, next) {
        if (!req.get('Origin')) {
            return next();
        }

        // use "*" here to accept any origin
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

        if ('OPTIONS' === req.method) {
            return res.send(200);
        }

        next();
    });
};

var configureAppServer = function () {
    app.set('port', process.env.PORT || appPort);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

// Asynchronous authentication
    app.use(express.basicAuth(admin.login));

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

//  Development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
};

configureApiServer();
configureAppServer();

//=============================================================================
//                      Prepare resources to expone
//=============================================================================
app.get('/', routes.index);

app.get('/patients', patient.findAll);
app.get('/patients/:id', patient.findById);
api.get('/patients/:id/notifications', patient.findNotificationsById);
app.post('/patients', patient.save);
app.put('/patients/:id', patient.update);

app.get('/treatments', treatment.findAll);

app.get('/users', user.findAll);
app.post('/users', user.save);

//  Example CRUD methods using MongoDB
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

//=============================================================================
//                      Finally creates de servers
//=============================================================================
http.createServer(api).listen(api.get('port'), function () {
    console.log('Express server listening for API requests on port ' + api.get('port'));
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening for APP requests on port ' + app.get('port'));
});


connectToDatabase();
function connectToDatabase() {
    var mongo = require('mongodb');

    var Server = mongo.Server;
    var Db = mongo.Db;
    BSON = mongo.BSONPure;

    var server = new Server(dbHost, dbPort, {auto_reconnect: true});
    db = new Db(dbName, server);

    db.open(function (err, db) {
        //  Populate database with sample data -- Only used once: the first time the application is started.
        //  You'd typically not find this code in a real-life app, since the database would already exist.
        var populateDB = function () {

            var winesCollectionName = 'wines';
            db.collection(winesCollectionName, {strict: true}, function (err, collection) {

                collection.remove({}, function (err, removed) {
                    console.log('Removed all records in ' + winesCollectionName + ' collection.');
                });

                console.log('The "' + winesCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                var wines = [
                    {
                        name: 'CHATEAU DE SAINT COSME',
                        year: '2009',
                        grapes: 'Grenache / Syrah',
                        country: 'France',
                        region: 'Southern Rhone',
                        description: 'The aromas of fruit and spice...',
                        picture: 'saint_cosme.jpg'
                    },
                    {
                        name: 'LAN RIOJA CRIANZA',
                        year: '2006',
                        grapes: 'Tempranillo',
                        country: 'Spain',
                        region: 'Rioja',
                        description: 'A resurgence of interest in boutique vineyards...',
                        picture: 'lan_rioja.jpg'
                    }
                ];
                db.collection(winesCollectionName, function (err, collection) {
                    collection.insert(wines, {safe: true}, function (err, result) {
                    });
                });
            });

            var adminsCollectionName = 'admins';
            db.collection(adminsCollectionName, {strict: true}, function (err, collection) {

                collection.remove({}, function (err, removed) {
                    console.log('Removed all records in ' + adminsCollectionName + ' collection.');
                });

                console.log('The "' + adminsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                var admins = [
                    {
                        username: 'admin', password: 'admin'
                    },
                    {
                        username: 'test', password: 'test'
                    }
                ];
                db.collection(adminsCollectionName, function (err, collection) {
                    collection.insert(admins, {safe: true}, function (err, result) {
                    });
                });
            });

            var treatmentsCollectionName = 'treatments';
            db.collection(treatmentsCollectionName, {strict: true}, function (err, collection) {

                collection.remove({}, function (err, removed) {
                    console.log('Removed all records in ' + treatmentsCollectionName + ' collection.');
                });

                console.log('The "' + treatmentsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                var treatments = [
                    {
                        description: 'Limpieza (complejidad 1)', revisions: [
                        {frequency: 12}
                    ]
                    },
                    {
                        description: 'Limpieza (complejidad 2)', revisions: [
                        {frequency: 6}
                    ]
                    },
                    {
                        description: 'Limpieza (complejidad 3)', revisions: [
                        {frequency: 3}
                    ]
                    },
                    {
                        description: 'Cirugías de implantes', revisions: [
                        {sequence: 1, frequency: 2, quantity: 2, description: 'Control radiográfico'},
                        {sequence: 2, frequency: 12, description: 'Revision anual radiológica'},
                        {sequence: 2, frequency: 6, description: 'Control cada 6 meses'}
                    ]
                    },
                    {
                        description: 'Implantes', types: [
                        {description: 'Elevación de seno', revisions: [
                            {frequency: 4.5, description: 'Control radiográfico', quantity: 2}
                        ]},
                        {description: 'Periodontal', revisions: [
                            {sequence: 1, frequency: 2, description: 'Control'},
                            {sequence: 2, frequency: 6, description: 'Control'},
                            {sequence: 3, frequency: 12, description: 'Control'}
                        ]},
                        {description: 'Exodoncia', revisions: [
                            {frequency: 3, description: 'Control radiográfico'}
                        ]}
                    ]
                    },
                    {
                        description: 'Tratamiento periodontal (complejidad 1)', revisions: [
                        {frequency: 12, description: 'Control'}
                    ]
                    },
                    {
                        description: 'Tratamiento periodontal (complejidad 2)', revisions: [
                        {frequency: 6, description: 'Control'}
                    ]
                    },
                    {
                        description: 'Tratamiento periodontal (complejidad 3)', revisions: [
                        {frequency: 3, description: 'Control'}
                    ]
                    },
                    {
                        description: 'Ortodoncia', revisions: [
                        {sequence: 1, frequency: 6, description: 'Control'},
                        {sequence: 2, frequency: 24, description: 'Control'}
                    ]
                    },
                    {
                        description: 'Control general anual', revisions: [
                        {frequency: 12, description: 'Control general anual'}
                    ]
                    }
                ];
                db.collection(treatmentsCollectionName, function (err, collection) {
                    collection.insert(treatments, {safe: true}, function (err, result) {
                    });
                });
            });

//            var patientsCollectionName = 'patients';
//            db.collection(patientsCollectionName, {strict: true}, function (err, collection) {
//
//                collection.remove({}, function (err, removed) {
//                    console.log('Removed all records in ' + patientsCollectionName + ' collection.');
//                });
//
//                console.log('The "' + patientsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
//                var patients = [
//                    {
//                        name: 'Nahuel', lastName: 'Barrios', birthday: 16101989
//                    },
//                    {
//                        name: 'Gustavo', lastName: 'Vignolo', birthday: 16101989
//                    },
//                    {
//                        name: 'Nicolas', lastName: 'Vignolo', birthday: 16101989
//                    },
//                    {
//                        name: 'Carolina', lastName: 'Vignolo', birthday: 16101989
//                    },
//                    {
//                        name: 'Patricia', lastName: 'Safranchik', birthday: 16101989
//                    },
//                    {
//                        name: 'Paola', lastName: 'Safranchik', birthday: 16101989
//                    },
//                    {
//                        name: 'Claudia', lastName: 'Safranchik', birthday: 16101989
//                    },
//                    {
//                        name: 'Cristian', lastName: 'Caputto', birthday: 16101989
//                    },
//                    {
//                        name: 'Tomas', lastName: 'Caputto', birthday: 16101989
//                    },
//                    {
//                        name: 'María Sol', lastName: 'Caputto', birthday: 16101989
//                    }
//                ];
//                db.collection(patientsCollectionName, function (err, collection) {
//                    collection.insert(patients, {safe: true}, function (err, result) {
//                    });
//                });
//            });

        };

        if (err) {
            console.dir(err);
        } else {
            console.log('Connected to "' + dbName + '" database');


            populateDB();
        }
    });
}