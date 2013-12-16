/*
 * GET users listing.
 */

exports.list = function (req, res) {
    res.send([
                 {
                     id: 1, name: 'Nahuel Barrios', description: 'first app user!'
                 },
                 {
                     id: 2, name: 'Gustavo Vignolo', description: 'Dr.'
                 }
             ]);
};

exports.id = function (req, res) {
    res.send({
                 id: req.params.id, name: "Nahuel Barrios", description: "first app user!"
             });
};