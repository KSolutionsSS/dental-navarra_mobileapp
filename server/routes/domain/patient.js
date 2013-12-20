/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */

(function () {
    var collectionName = 'patients';

    exports.findAll = function (req, res) {
        console.log('Finding all patients');
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    exports.findById = function (req, res) {
        var id = req.params.id;
        console.log('Retrieving patient: ' + id);
        db.collection(collectionName, function (err, collection) {
            collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
                res.send(item);
            });
        });
    };

}());

