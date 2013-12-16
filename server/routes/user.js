/*
 * GET users listing.
 */

exports.findAll = function (req, res) {
    res.send([
                 {
                     findAllById: 1, name: 'Nahuel Barrios', description: 'first app user!'
                 },
                 {
                     findAllById: 2, name: 'Gustavo Vignolo', description: 'Dr.'
                 }
             ]);
};

exports.findAllById = function (req, res) {
    res.send({
                 findAllById: req.params.findAllById, name: "Nahuel Barrios", description: "first app user!"
             });
};