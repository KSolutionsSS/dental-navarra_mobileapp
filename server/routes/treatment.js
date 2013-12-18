/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */
exports.findAll = function (req, res) {
    res.send([
                 {
                     id: 2, description: 'Implante'
                 },
                 {
                     id: 1, description: 'Limpieza'
                 },
                 {
                     id: 3, description: 'Consulta periódica'
                 }
             ]);
};