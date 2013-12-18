/*
 * GET users listing.
 */

exports.findAll = function (req, res) {
    res.send([
                 {
                     id: 1, name: 'Nahuel', lastName: 'Barrios', tokens: 'Nahuel Barrios'.split(' ')
                 },
                 {
                     id: 2, name: 'Gustavo', lastName: 'Vignolo', tokens: 'Gustavo Vignolo'.split(' ')
                 },
                 {
                     id: 3, name: 'Nicolas', lastName: 'Vignolo', tokens: 'Nicolas Vignolo'.split(' ')
                 },
                 {
                     id: 4, name: 'Carolina', lastName: 'Vignolo', tokens: 'Carolina Vignolo'.split(' ')
                 },
                 {
                     id: 5, name: 'Patricia', lastName: 'Safranchik', tokens: 'Patricia Safranchik'.split(' ')
                 },
                 {
                     id: 6, name: 'Paola', lastName: 'Safranchik', tokens: 'Paola Safranchik'.split(' ')
                 },
                 {
                     id: 7, name: 'Claudia', lastName: 'Safranchik', tokens: 'Claudia Safranchik'.split(' ')
                 },
                 {
                     id: 8, name: 'Cristian', lastName: 'Caputto', tokens: 'Cristian Caputto'.split(' ')
                 },
                 {
                     id: 9, name: 'Tomas', lastName: 'Caputto', tokens: 'Tomas Caputto'.split(' ')
                 },
                 {
                     id: 10, name: 'María Sol', lastName: 'Caputto', tokens: 'María Sol Caputto'.split(' ')
                 }
             ]);
};

exports.findById = function (req, res) {
    res.send({
                 id: req.params.id, name: 'Nahuel', lastName: 'Barrios'
             });
};