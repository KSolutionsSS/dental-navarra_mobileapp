/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 07/01/14, at 14:35.
 */
(function () {
    var collectionName = 'admins';

    exports.login = function (username, password, callback) {
        console.log('Trying to login with: ' + username + '/' + password);

        db.collection(collectionName, function (err, collection) {
            collection.findOne({'username': username}, function (err, item) {
                findAll(function (err, admins) {

                    callback(err, admins.some(function (each) {
                        return each.username === username && each.password === password;
                    }));

                });
            });
        });
    };


    var findAll = function (callback) {
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(callback);
        });
    };

}());

