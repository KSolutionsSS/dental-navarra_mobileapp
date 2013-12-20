/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/17/13, at 7:13 PM.
 */
(function () {
    var collectionName = 'treatments';

    exports.findAll = function (req, res) {
        console.log('Finding all treatments');
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };
}());