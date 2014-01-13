/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 02/01/14, at 14:27.
 */

(function () {
    var collectionName = 'users';

    exports.findAll = function (req, res) {
        console.log('Finding all users');
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    exports.save = function (req, res) {
        var user = req.body;
        console.log('Adding user: ' + JSON.stringify(user));
        db.collection(collectionName, {strict: true}, function (err, collection) {
            collection.insert(user, {safe: true}, function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred trying to save a user'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        });
    };

}());

