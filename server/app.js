/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

//  Application properties
var appPort = 8080;

var dbName = 'mispacientesdb';
var dbHost = 'localhost';
var dbPort = 27017;
var dbCollections = {
    patients: 'patients',
    admins: 'admins',
    treatments: 'treatments'
};

//  Module dependencies
var express = require('express');

var routes = require('./routes');

//  Own module dependencies
var admin = require('./routes/domain/admin');
var patient = require('./routes/domain/patient');
var treatment = require('./routes/domain/treatment');

//  TODO : Delete this line or context.
var wine = require('./routes/domain/wine');

var http = require('http');
var path = require('path');

var app = express();

//=============================================================================
//                      Configure server
//=============================================================================
var configureAppServer = function () {
    app.set('port', process.env.PORT || appPort);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

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

configureAppServer();

// Asynchronous authentication
var auth = express.basicAuth(admin.login);

//=============================================================================
//                      Prepare resources to expone
//=============================================================================
app.get('/', auth, routes.index);
app.get('/patients', auth, patient.findAll);
app.get('/patients/:id', auth, patient.findById);
app.get('/patients/:id/notifications', patient.findNotificationsById);
app.put('/patients/:id', auth, patient.update);
app.post('/patients', auth, patient.save);
app.post('/patients/:username/login', patient.login);

app.get('/treatments', auth, treatment.findAll);

//  Example CRUD methods using MongoDB
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

//=============================================================================
//                      Finally creates the server
//=============================================================================

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening for APP requests on port ' + app.get('port'));
});

//=============================================================================
//                      Connect to database and populates it
//=============================================================================


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
//    , format = require('util').format;
BSON = mongo.BSONPure;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

MongoClient.connect(mongoUri, function (err, db) {
    var clearCollection = function (collection, collectionName, callback) {
        console.log('Clearing collection: ' + collectionName);
        collection.remove({}, function (err, removed) {
            console.log('Collection cleared ' + collectionName);

            if (callback) {
                callback(err, removed);
            }
        });
    };
    var populateCollection = function (collection, collectionName, data) {
        clearCollection(collection, collectionName, function (err, removed) {
            console.log('The "' + collectionName + '" collection has no records. Adding sample data...');

            collection.insert(data, {safe: true}, function (err, result) {
                console.log('Inserted ' + result.length + ' records in collection: ' + collectionName);
            });
        });
    };
    //  End of utility methods

    if (err) {
        console.log('no me pude conectar, tirando error...');
        throw err;
    }

    db.collectionNames(function (err, collections) {
        console.log('Available collections in DB:');
        console.log(collections);
    });

    //  Creating collections
    db.createCollection(dbCollections.admins, function (err, collection) {
        if (err) {
            console.log('An error occured while creating collection named: ' + dbCollections.admins);
            console.log('Error: ' + err);
            throw err;
        }

        console.log('Collection created successfuly: ' + dbCollections.admins);

        populateCollection(collection, dbCollections.admins, [
            {
                username: 'admin', password: '1q2w3e4r'
            },
            {
                username: 'test', password: 'solar'
            }
        ]);
    });

    db.createCollection(dbCollections.patients, function (err, collection) {
        if (err) {
            console.log('An error occured while creating collection named: ' + dbCollections.patients);
            console.log('Error: ' + err);
            throw err;
        }

        console.log('Collection created successfuly: ' + dbCollections.patients);
    });

    db.createCollection(dbCollections.treatments, function (err, collection) {
        if (err) {
            console.log('An error occured while creating collection named: ' + dbCollections.treatments);
            console.log('Error: ' + err);
            throw err;
        }

        console.log('Collection created successfuly: ' + dbCollections.admins);

        populateCollection(collection, dbCollections.treatments, [
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
        ]);
    });
});


//connectToDatabase();
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

//            var winesCollectionName = 'wines';
//            db.collection(winesCollectionName, {strict: true}, function (err, collection) {
//
//                collection.remove({}, function (err, removed) {
//                    console.log('Removed all records in ' + winesCollectionName + ' collection.');
//                });
//
//                console.log('The "' + winesCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
//                var wines = [
//                    {
//                        name: 'CHATEAU DE SAINT COSME',
//                        year: '2009',
//                        grapes: 'Grenache / Syrah',
//                        country: 'France',
//                        region: 'Southern Rhone',
//                        description: 'The aromas of fruit and spice...',
//                        picture: 'saint_cosme.jpg'
//                    },
//                    {
//                        name: 'LAN RIOJA CRIANZA',
//                        year: '2006',
//                        grapes: 'Tempranillo',
//                        country: 'Spain',
//                        region: 'Rioja',
//                        description: 'A resurgence of interest in boutique vineyards...',
//                        picture: 'lan_rioja.jpg'
//                    }
//                ];
//                db.collection(winesCollectionName, function (err, collection) {
//                    collection.insert(wines, {safe: true}, function (err, result) {
//                    });
//                });
//            });

            var adminsCollectionName = 'admins';
            db.collection(adminsCollectionName, {strict: true}, function (err, collection) {

                collection.remove({}, function (err, removed) {
                    console.log('Removed all records in ' + adminsCollectionName + ' collection.');
                });

                console.log('The "' + adminsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                var admins = [
                    {
                        username: 'admin', password: '1q2w3e4r'
                    },
                    {
                        username: 'test', password: 'solar'
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