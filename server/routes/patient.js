/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */
exports.findAll = function (req, res) {
    res.send([
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
             ]);
};

exports.findById = function (req, res) {
    res.send({
                 id: req.params.id, name: 'Nahuel', lastName: 'Barrios'
             });
};