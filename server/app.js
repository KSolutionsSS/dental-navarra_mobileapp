/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

//  Application properties
var port = 8080;

var dbName = 'mispacientesdb';
var dbHost = 'localhost';
var dbPort = 27017;

//  Module dependencies
var express = require('express');
var routes = require('./routes');

var patient = require('./routes/domain/patient');
var treatment = require('./routes/domain/treatment');
var wine = require('./routes/domain/wine');

var http = require('http');
var path = require('path');

var app = express();

//  All environments
app.set('port', process.env.PORT || port);
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

//  Prepare resources expose
app.get('/', routes.index);

app.get('/patients', patient.findAll);
app.get('/patients/:id', patient.findById);

app.get('/treatments', treatment.findAll);

//  Example CRUD methods using MongoDB
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

connectToDatabase();

//  Finally creates de server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


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
                if (err) {
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
                }
            });

            var treatmentsCollectionName = 'treatments';
            db.collection(treatmentsCollectionName, {strict: true}, function (err, collection) {
                if (err) {
                    console.log('The "' + treatmentsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                    var treatments = [
                        {
                            id: 2, description: 'Limpieza'
                        },
                        {
                            id: 1, description: 'Cirugía'
                        },
                        {
                            id: 3, description: 'Implantes'
                        },
                        {
                            id: 4, description: 'Ortodoncia'
                        },
                        {
                            id: 5, description: 'Tratamiento periodontal'
                        }
                    ];
                    db.collection(treatmentsCollectionName, function (err, collection) {
                        collection.insert(treatments, {safe: true}, function (err, result) {
                        });
                    });
                }
            });

            var patientsCollectionName = 'patients';
            db.collection(patientsCollectionName, {strict: true}, function (err, collection) {
                if (err) {
                    console.log('The "' + patientsCollectionName + '" collection doesn\'t exist. Creating it with sample data...');
                    var patients = [
                        {
                            id: 1, name: 'Nahuel', lastName: 'Barrios'
                        },
                        {
                            id: 2, name: 'Gustavo', lastName: 'Vignolo'
                        },
                        {
                            id: 3, name: 'Nicolas', lastName: 'Vignolo'
                        },
                        {
                            id: 4, name: 'Carolina', lastName: 'Vignolo'
                        },
                        {
                            id: 5, name: 'Patricia', lastName: 'Safranchik'
                        },
                        {
                            id: 6, name: 'Paola', lastName: 'Safranchik'
                        },
                        {
                            id: 7, name: 'Claudia', lastName: 'Safranchik'
                        },
                        {
                            id: 8, name: 'Cristian', lastName: 'Caputto'
                        },
                        {
                            id: 9, name: 'Tomas', lastName: 'Caputto'
                        },
                        {
                            id: 10, name: 'María Sol', lastName: 'Caputto'
                        }
                    ];
                    db.collection(patientsCollectionName, function (err, collection) {
                        collection.insert(patients, {safe: true}, function (err, result) {
                        });
                    });
                }
            });

        };

        if (err) {
            console.dir(err);
        } else {
            console.log('Connected to "' + dbName + '" database');


            populateDB();
        }


    });

}