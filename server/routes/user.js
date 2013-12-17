/*
 * GET users listing.
 */

exports.findAll = function (req, res) {
    res.send([
                 {
                     id: 1, name: 'Nahuel Barrios', description: 'first app user!'
                 },
                 {
                     id: 2, name: 'Gustavo Vignolo', description: 'Dr.'
                 }
             ]);
};

exports.findById = function (req, res) {
    res.send({
                 id: req.params.id, name: "Nahuel Barrios", description: "first app user!"
             });
};