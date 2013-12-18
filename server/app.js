/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var patient = require('./routes/patient');
var treatment = require('./routes/treatment');
var wine = require('./routes/wine');
var http = require('http');
var path = require('path');

var app = express();

//  All environments
app.set('port', process.env.PORT || 8080);
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
app.get('/patients/:findById', patient.findById);

app.get('/treatments', treatment.findAll);

//  Example CRUD methods using MongoDB
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

//  Finally creates de server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
